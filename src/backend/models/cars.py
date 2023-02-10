from pydantic import Field
from typing import Optional

from models.base_model import MongoBaseModel

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
    owner: str = Field(...)
