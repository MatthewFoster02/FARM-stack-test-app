from fastapi import APIRouter, Request, Body, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from models import CarBase

router = APIRouter()

@router.get('/', response_description='List all cars')
async def list_cars():
    return {'data': 'All cars will be here'}

@router.post('/', response_description='Add new car')
async def create_car(request: Request, car: CarBase = Body(...)):
    car = jsonable_encoder(car)
    new_car = await request.app.mongodb['cars2'].insert_one(car)
    created_car = await request.app.mongodb['cars2'].find_one({'_id': new_car.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)
