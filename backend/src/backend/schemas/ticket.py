from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from backend.common.enums import TicketPriority, TicketStatus
from backend.schemas.category import CategoryResponse
from backend.schemas.comment import CommentDetailResponse
from backend.schemas.user import UserSummary


class TicketCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    category_id: UUID


class TicketResponse(BaseModel):
    id: UUID
    subject: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    requester: UserSummary
    assignee: UserSummary | None
    category: CategoryResponse
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
    page: int
    page_size: int


class TicketDetailResponse(TicketResponse):
    comments: list[CommentDetailResponse]


class TicketFilters(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)

    status: list[TicketStatus] | None = None
    priority: list[TicketPriority] | None = None
    category_id: UUID | None = None
    assignee: UUID | Literal["me", "unassigned"] | None = None
    search: str | None = None

    sort_by: Literal["created_at", "priority"] = "created_at"
    sort_order: Literal["asc", "desc"] = "desc"


class TicketUpdate(BaseModel):
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    assignee_id: UUID | None = None