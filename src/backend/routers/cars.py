from fastapi import APIRouter, Request, Body, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from typing import Optional, List

from models import CarBase, CarDB, CarUpdate

router = APIRouter()

@router.get('/', response_description='List all cars')
async def list_all_cars(
    request:Request,
    min_price:int=0,
    max_price:int=100000,
    brand:Optional[str]=None,
    page:int=1,
    results_per_page:int=25
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

@router.post('/', response_description='Add new car')
async def create_car(request:Request, car:CarBase=Body(...)):
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

@router.patch('/{id}', response_description='Update car')
async def update_car(id:str, request:Request, car:CarUpdate=Body(...)):
    await request.app.mongodb['cars2'].update_one(
        {'_id': id}, {'$set': car.dict(exclude_unset=True)}
    )
    car = await request.app.mongodb['cars2'].find_one({'_id': id})

    if car is not None:
        return CarDB(**car)

    raise HTTPException(status_code=404, detail=f"Car with id: {id} not found")

@router.delete('/{id}', response_description='Delete car')
async def delete_car(id:str, request:Request):
    delete_result = await request.app.mongodb['cars2'].delete_one({'_id': id})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Car with id: {id} not found")
