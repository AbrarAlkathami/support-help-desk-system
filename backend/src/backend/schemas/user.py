from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from backend.common.enums import UserRole


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole = UserRole.USER


class UserUpdate(BaseModel):
    role: UserRole | None = None
    is_active: bool | None = None


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class UserSummary(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)