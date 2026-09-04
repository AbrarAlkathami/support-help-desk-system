from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from backend.crud.user import user_crud
from backend.crud.category import category_crud
from backend.crud.ticket import ticket_crud
from backend.models import Ticket, User
from backend.common.enums import UserRole
from backend.schemas.ticket import TicketCreate, TicketFilters, TicketUpdate, TicketStatus

async def create_ticket(db: AsyncSession, data: TicketCreate, requester: User) -> Ticket | None:

    category = await category_crud.get(db, data.category_id)

    if category is None:
        return None

    ticket = await ticket_crud.create(
        db,
        {
            **data.model_dump(),
            "requester_id": requester.id,
        },
    )

    await db.commit()

    return ticket


async def get_ticket(db: AsyncSession, ticket_id: UUID) -> Ticket | None:
    return await ticket_crud.get_with_relations(db, ticket_id)


async def list_tickets(
    db: AsyncSession,
    current_user: User,
    filters: TicketFilters,
) -> tuple[list[Ticket], int]:
    requester_id = None
    assignee_id = None
    unassigned = False

    if current_user.role == UserRole.USER:
        requester_id = current_user.id

    if filters.assignee == "me":
        assignee_id = current_user.id
    elif filters.assignee == "unassigned":
        unassigned = True
    elif filters.assignee is not None:
        assignee_id = filters.assignee

    return await ticket_crud.get_page(
        db=db,
        page=filters.page,
        page_size=filters.page_size,
        requester_id=requester_id,
        status=filters.status,
        priority=filters.priority,
        category_id=filters.category_id,
        assignee_id=assignee_id,
        unassigned=unassigned,
        search=filters.search,
        sort_by=filters.sort_by,
        sort_order=filters.sort_order,
    )

async def update_ticket(
    db: AsyncSession,
    ticket_id: UUID,
    data: TicketUpdate,
) -> Ticket | None:
    ticket = await ticket_crud.get(db, ticket_id)

    if ticket is None:
        return None

    update_data = data.model_dump(exclude_unset=True)

    if "assignee_id" in update_data and update_data["assignee_id"] is not None:
        assignee = await user_crud.get(db, update_data["assignee_id"])

        if assignee is None:
            raise LookupError("Assignee not found")

        if assignee.role != UserRole.MODERATOR:
            raise ValueError("Tickets can only be assigned to moderators")

    ticket = await ticket_crud.update(db, ticket, update_data)

    await db.commit()

    return ticket

def can_access_ticket(ticket: Ticket, current_user: User) -> bool:
    if current_user.role in (UserRole.MODERATOR, UserRole.ADMIN):
        return True

    return ticket.requester_id == current_user.id


async def close_ticket(db: AsyncSession, ticket_id: UUID) -> Ticket | None:
    ticket = await ticket_crud.get(db, ticket_id)

    if ticket is None:
        return None

    ticket = await ticket_crud.update(
        db,
        ticket,
        {
            "status": TicketStatus.CLOSED,
        },
    )

    await db.commit()

    return ticket