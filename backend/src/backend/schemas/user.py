from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from backend.common.enums import UserRole


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool

    model_config = ConfigDict(from_attributes=True)