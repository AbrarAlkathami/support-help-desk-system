from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from backend.schemas.user import UserSummary


class CommentCreate(BaseModel):
    body: str = Field(min_length=1)


class CommentResponse(BaseModel):
    id: UUID
    ticket_id: UUID
    author_id: UUID
    body: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommentDetailResponse(CommentResponse):
    author: UserSummary