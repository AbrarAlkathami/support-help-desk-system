from pydantic import BaseModel

from backend.common.enums import TicketStatus


class StatusMetric(BaseModel):
    status: TicketStatus
    count: int


class CategoryMetric(BaseModel):
    category: str
    count: int


class MetricsResponse(BaseModel):
    total_tickets: int
    by_status: list[StatusMetric]
    by_category: list[CategoryMetric]