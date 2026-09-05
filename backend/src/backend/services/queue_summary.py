from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.ticket import ticket_crud
from backend.common.enums import TicketPriority
from backend.schemas.queue_summary import QueueSummaryResponse


SLA_HOURS: dict[TicketPriority, int] = {
    TicketPriority.URGENT: 4,
    TicketPriority.HIGH: 8,
    TicketPriority.MEDIUM: 24,
    TicketPriority.LOW: 48,
}


async def get_queue_summary(
    db: AsyncSession,
    current_user_id: UUID,
) -> QueueSummaryResponse:
    counts = await ticket_crud.get_queue_summary_counts(
        db=db,
        current_user_id=current_user_id,
        now=datetime.now(timezone.utc),
        sla_hours=SLA_HOURS,
    )

    return QueueSummaryResponse(
        unassigned=counts.unassigned or 0,
        assigned_to_me=counts.assigned_to_me or 0,
        overdue=counts.overdue or 0,
    )