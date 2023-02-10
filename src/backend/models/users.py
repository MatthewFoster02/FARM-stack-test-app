from enum import Enum
from pydantic import Field, validator, EmailStr, BaseModel
from email_validator import validate_email, EmailNotValidError
from models.base_model import MongoBaseModel

class Role(str, Enum):
    SALESPERSON = 'SALESPERSON'
    ADMIN = 'ADMIN'

class UserBase(MongoBaseModel):
    username: str = Field(..., max_length=16)
    email: str = Field(...)
    password: str = Field(...)
    role: Role

    @validator('email')
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise EmailNotValidError

class LoginBase(BaseModel):
    email: str = EmailStr(...)
    password: str = Field(...)

class CurrentUser(BaseModel):
    email: str = EmailStr(...)
    username: str = Field(...)
    role: str = Field(...)
