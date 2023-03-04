from io import BytesIO
from fastapi import APIRouter, Request, Body, status, HTTPException, Depends, UploadFile, File, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from typing import Optional, List
from decouple import config
from PIL import Image, ImageOps
import cloudinary
import cloudinary.uploader
import math

from models.cars import CarBase, CarDB, CarUpdate
from authentication import Authorization

CLOUD_NAME = config("CLOUDINARY_NAME", cast=str)
API_KEY = config("CLOUDINARY_KEY", cast=str)
API_SECRET = config("CLOUDINARY_SECRET", cast=str)

cloudinary.config(
    cloud_name = CLOUD_NAME,
    api_key = API_KEY,
    api_secret = API_SECRET
)

router = APIRouter()
authorization = Authorization()

RESULTS_PER_PAGE = 20

@router.get('/', response_description='List all cars')
async def list_all_cars(
    request:Request,
    min_price:int=0,
    max_price:int=100000,
    brand:Optional[str]=None,
    page:int=1,
    results_per_page:int=RESULTS_PER_PAGE
    ) -> List[CarDB]: # Default parameters, type hinting that return will be List of cars
    skip = (page - 1) * results_per_page
    query = {
        'price': {'$lt': max_price, '$gt': min_price}
    }

    if brand:
        query['brand'] = brand
    
    full_query = request.app.mongodb['cars2'].find(query).sort('_id', 1).skip(skip).limit(results_per_page)
    results = [CarDB(**raw_car) async for raw_car in full_query]
    return results

@router.get('/brands', response_description='Get all unique brands')
async def unique_brands(request:Request) -> List[str]:
    brands = await request.app.mongodb['cars2'].distinct('brand')
    return JSONResponse(status_code=status.HTTP_200_OK, content={"brands": brands})

@router.get('/pages', response_description='Get total pages')
async def page_total(request:Request, brand:Optional[str]=None):
    query = {}
    if brand:
        query['brand'] = brand
    doc_count = await request.app.mongodb['cars2'].count_documents(query)
    pages_total = math.ceil(doc_count / RESULTS_PER_PAGE)
    return JSONResponse(status_code=status.HTTP_200_OK, content={'pages': int(pages_total)})

@router.post('/', response_description='Add new car (with picture)')
async def create_car(
    request:Request,
    brand:str=Form('brand'),
    make:str=Form('make'),
    year:int=Form('year'),
    cm3:int=Form('cm3'),
    price:int=Form('price'),
    km:int=Form('km'),
    picture:UploadFile=File(...),
    userID=Depends(authorization.auth_wrapper)
    ):

    original_image = Image.open(picture.file)
    out_image = BytesIO()
    original_image.save(out_image, 'JPEG')
    out_image.seek(0)

    result = cloudinary.uploader.upload(
        out_image,
        folder='UsedCars',
        crop='scale',
        width=800
    )

    url = result.get('url')

    car = CarDB(
        brand=brand,
        price=price,
        cm3=cm3,
        km=km,
        make=make,
        year=year,
        picture=url,
        owner=userID
    )
    car = jsonable_encoder(car)
    new_car = await request.app.mongodb['cars2'].insert_one(car)
    created_car = await request.app.mongodb['cars2'].find_one({'_id': new_car.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)

@router.get('/{id}', response_description='Get single car by ID')
async def get_car_by_ID(id:str, request:Request) -> CarDB:
    car = await request.app.mongodb['cars2'].find_one({'_id': id})

    if car is not None:
        return CarDB(**car)
    
    raise HTTPException(status_code=404, detail=f"Car with id: {id} not found")

@router.patch('/{id}', response_description='Update car with ID')
async def update_car(id:str, request:Request, car:CarUpdate=Body(...), userID=Depends(authorization.auth_wrapper)):
    # Check user authorized to update car
    await checkOwnerOrAdmin(id, request, userID)

    await request.app.mongodb['cars2'].update_one(
        {'_id': id}, {'$set': car.dict(exclude_unset=True)}
    )

    car = await request.app.mongodb['cars2'].find_one({'_id': id})

    if car is not None:
        return CarDB(**car)

    raise HTTPException(status_code=404, detail=f"Car with id: {id} not found")

@router.delete('/{id}', response_description='Delete car with ID')
async def delete_car(id:str, request:Request, userID=Depends(authorization.auth_wrapper)):
    # Check user authorized to update car
    await checkOwnerOrAdmin(id, request, userID)

    delete_result = await request.app.mongodb['cars2'].delete_one({'_id': id})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Car with id: {id} not found")

async def checkOwnerOrAdmin(id:str, request:Request, userID:str):
    # Get user using userID and car using id
    user = await request.app.mongodb['users'].find_one({'_id': userID})
    car_to_update = await request.app.mongodb['cars2'].find_one({'_id': id})

    # Check that owner of car is user or user is admin
    if(userID != car_to_update['owner'] and user['role'] != 'ADMIN'):
        raise HTTPException(status_code=401, detail='Only owner of car or ADMIN can update an existing car')
