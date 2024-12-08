from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class User(BaseModel):
    """Base user model"""
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    disabled: Optional[bool] = False

class UserCreate(User):
    """User creation model"""
    password: str = Field(..., min_length=8)

class UserInDB(User):
    """User model stored in database"""
    hashed_password: str
