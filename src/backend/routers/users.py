from fastapi import APIRouter, Request, Body, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.users import UserBase, LoginBase, CurrentUser
from authentication import Authorization

router = APIRouter()
authorization = Authorization()

@router.post('/register', response_description='Register user')
async def register(request:Request, newUser:UserBase=Body(...)) -> UserBase:
    newUser.password = authorization.get_password_hash(newUser.password)
    newUser = jsonable_encoder(newUser)

    if await check_existing_fields('email', request, newUser):
        raise HTTPException(status_code=409, detail=f"User with email {newUser['email']} already exists")
    if await check_existing_fields('username', request, newUser):
        raise HTTPException(status_code=409, detail=f"User with username {newUser['username']} already exists")
    
    user = await request.app.mongodb['users'].insert_one(newUser)
    created_user = await request.app.mongodb['users'].find_one({'_id': user.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)

async def check_existing_fields(field:str, request:Request, newUser:dict) -> bool:
    field_exists = await request.app.mongodb['users'].find_one({field: newUser[field]})
    print(field_exists)
    return field_exists is not None

@router.post('/login', response_description='Login user')
async def login(request:Request, loginUser:LoginBase=Body(...)) -> str:
    user = await request.app.mongodb['users'].find_one({'email': loginUser.email})

    if(user is None) or not(authorization.verify_password(loginUser.password, user['password'])):
        raise HTTPException(status_code=401, detail='Invalid email and/or password')
    
    token = authorization.encode_token(user['_id'])
    res = JSONResponse(content={'token': token})
    return res

@router.get('/me', response_description='Logged in user\'s data')
async def me(request:Request, userID=Depends(authorization.auth_wrapper)) -> JSONResponse:
    currentUser = await request.app.mongodb['users'].find_one({'_id': userID})
    result = CurrentUser(**currentUser).dict()
    result['id'] = userID
    return JSONResponse(status_code=status.HTTP_200_OK, content=result)
