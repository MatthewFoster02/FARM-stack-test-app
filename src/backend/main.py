import uvicorn
from decouple import config
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# Import all sub-routes and rename to specific route
from routers.cars import router as cars_router
from routers.users import router as users_router

DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)
COLLECTION_NAME = config('COLLECTION_NAME', cast=str)

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

app = FastAPI(middleware=middleware)

app.include_router(cars_router, prefix='/cars', tags=['cars'])
app.include_router(users_router, prefix='/users', tags=['users'])

@app.on_event('startup')
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_client[DB_NAME]

@app.on_event('shutdown')
async def shutdown_db_client():
    app.mongodb_client.close()

if __name__ == '__main__':
    uvicorn.run(
        'main:app',
        reload=True
    )
