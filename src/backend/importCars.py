import csv
from fastapi.encoders import jsonable_encoder

# dotenv environment variables
from decouple import config

from models import CarBase

DB_URL = config('DB_URL', cast=str)
DB_NAME = config('DB_NAME', cast=str)
COLLECTION_NAME = config('COLLECTION_NAME', cast=str)

# read csv
with open("sample_data.csv",encoding='utf-8') as f:
    csv_reader = csv.DictReader(f)
    name_records = list(csv_reader)

# Mongo db - we do not need Motor here
from pymongo import MongoClient
client = MongoClient()

client = MongoClient(DB_URL)
db = client[DB_NAME]
cars = db[COLLECTION_NAME]

i = 0
for rec in name_records:
    try:
        rec['cm3'] = int(rec['cm3'])
        rec['price'] = int(rec['price'])
        rec['year'] = int(rec['year'])

        
        car = jsonable_encoder(CarBase(**rec))  
        cars.insert_one(car)

    except ValueError:
        pass
    if i % 100 == 0:
        print(f"{i} cars inserted!")
    i += 1

print("DONE!")
