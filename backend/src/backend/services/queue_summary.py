from datetime import datetime, timedelta, timezone

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.ticket import ticket_crud
from backend.common.enums import TicketPriority , TicketStatus
from backend.schemas.queue_summary import QueueSummaryResponse
from backend.schemas.ticket import TicketResponse


SLA_HOURS: dict[TicketPriority, int] = {
    TicketPriority.URGENT: 4,
    TicketPriority.HIGH: 8,
    TicketPriority.MEDIUM: 24,
    TicketPriority.LOW: 48,
}

def get_ticket_sla(ticket):
    created_at = ticket.created_at

    # Database timestamps are stored as UTC but may be timezone-naive.
    if created_at.tzinfo is None:
        created_at = created_at.replace(
            tzinfo=timezone.utc
        )
    else:
        created_at = created_at.astimezone(
            timezone.utc
        )

    sla_due_at = created_at + timedelta(
        hours=SLA_HOURS[ticket.priority]
    )

    is_active = ticket.status in {
        TicketStatus.OPEN,
        TicketStatus.IN_PROGRESS,
    }

    is_overdue = (
        is_active
        and datetime.now(timezone.utc) > sla_due_at
    )

    return sla_due_at, is_overdue

def build_ticket_response(ticket) -> TicketResponse:
    sla_due_at, is_overdue = get_ticket_sla(ticket)

    return TicketResponse(
        id=ticket.id,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        requester=ticket.requester,
        assignee=ticket.assignee,
        category=ticket.category,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        sla_due_at=sla_due_at,
        is_overdue=is_overdue,
    )
    
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