from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional

class PyObjectID(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not(ObjectId.is_valid(v)):
            raise ValueError("Invalid Object")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class MongoBaseModel(BaseModel):
    id: PyObjectID = Field(default_factory=PyObjectID, alias='_id')
    class Config:
        json_encoders = {ObjectId: str}

class CarBase(MongoBaseModel):
    brand: str = Field(...)
    make: str = Field(...)
    year: int = Field(...)
    price: int = Field(...)
    km: int = Field(...)
    cm3: int = Field(...)

class CarUpdate(MongoBaseModel):
    brand: Optional[str] = None
    make: Optional[str] = None
    year: Optional[int] = None
    price: Optional[int] = None
    km: Optional[int] = None
    cm3: Optional[int] = None

class CarDB(CarBase):
    pass
