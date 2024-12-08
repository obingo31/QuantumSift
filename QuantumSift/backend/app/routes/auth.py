from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

from app.core.security import (
    create_access_token, 
    verify_password, 
    get_password_hash
)
from app.models.user import User, UserCreate, UserInDB

router = APIRouter()

# Simulated user database (replace with actual database in production)
fake_users_db = {}

def get_user(username: str):
    """Retrieve user from database"""
    return fake_users_db.get(username)

def authenticate_user(username: str, password: str):
    """Authenticate user credentials"""
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

@router.post("/register")
async def register_user(user: UserCreate):
    """User registration endpoint"""
    if user.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = UserInDB(
        username=user.username, 
        hashed_password=hashed_password,
        email=user.email
    )
    
    fake_users_db[user.username] = db_user
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """User login endpoint"""
    user = authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.username}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@router.get("/me")
async def read_users_me():
    """Get current user details"""
    # Implement token validation and user retrieval
    return {"message": "User profile endpoint"}
