from pydantic import BaseModel


class QueueSummaryResponse(BaseModel):
    unassigned: int
    assigned_to_me: int
    overdue: int