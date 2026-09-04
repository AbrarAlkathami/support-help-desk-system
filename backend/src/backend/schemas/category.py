from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class CategoryResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class CategoryResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)