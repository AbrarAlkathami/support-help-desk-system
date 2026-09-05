from uuid import UUID
from datetime import datetime, timedelta

from sqlalchemy import asc, case, desc, func, and_, or_, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from backend.common.enums import TicketPriority, TicketStatus
from backend.crud.base import CRUDBase
from backend.models import Category, Ticket


ACTIVE_STATUSES = [
    TicketStatus.OPEN,
    TicketStatus.IN_PROGRESS,
]

class CRUDTicket(CRUDBase[Ticket]):
    async def get_page(
        self,
        db: AsyncSession,
        page: int,
        page_size: int,
        requester_id: UUID | None = None,
        status: list[TicketStatus] | None = None,
        priority: list[TicketPriority] | None = None,
        category_id: UUID | None = None,
        assignee_id: UUID | None = None,
        unassigned: bool = False,
        search: str | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> tuple[list[Ticket], int]:
        conditions = []

        if requester_id is not None:
            conditions.append(Ticket.requester_id == requester_id)

        if status:
            conditions.append(Ticket.status.in_(status))

        if priority:
            conditions.append(Ticket.priority.in_(priority))
            
        if category_id is not None:
            conditions.append(Ticket.category_id == category_id)

        if assignee_id is not None:
            conditions.append(Ticket.assignee_id == assignee_id)

        elif unassigned:
            conditions.append(Ticket.assignee_id.is_(None))

        if search:
            search_term = f"%{search.strip()}%"
            conditions.append(
                or_(
                    Ticket.subject.ilike(search_term),
                    Ticket.description.ilike(search_term),
                )
            )

        query = (
            select(Ticket)
            .options(
                selectinload(Ticket.requester),
                selectinload(Ticket.assignee),
                selectinload(Ticket.category),
            )
            .where(*conditions)
        )
        count_query = select(func.count()).select_from(Ticket).where(*conditions)

        if sort_by == "priority":
            sort_column = case(
                (Ticket.priority == TicketPriority.LOW, 1),
                (Ticket.priority == TicketPriority.MEDIUM, 2),
                (Ticket.priority == TicketPriority.HIGH, 3),
                (Ticket.priority == TicketPriority.URGENT, 4),
            )
        else:
            sort_column = Ticket.created_at

        order = desc(sort_column) if sort_order == "desc" else asc(sort_column)

        query = (
            query
            .order_by(order)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result = await db.execute(query)
        total = await db.scalar(count_query)

        return list(result.scalars().all()), total or 0


    async def get_with_relations(self, db: AsyncSession, ticket_id: UUID) -> Ticket | None:
        result = await db.execute(
            select(Ticket)
            .options(
                selectinload(Ticket.requester),
                selectinload(Ticket.assignee),
                selectinload(Ticket.category),
            )
            .where(Ticket.id == ticket_id)
        )

        return result.scalar_one_or_none()

    async def count_all(self, db: AsyncSession) -> int:
        return await db.scalar(
            select(func.count()).select_from(Ticket)
        ) or 0


    async def count_by_status(self, db: AsyncSession):
        result = await db.execute(
            select(Ticket.status, func.count(Ticket.id))
            .group_by(Ticket.status)
        )

        return result.all()


    async def count_by_category(self, db: AsyncSession):
        result = await db.execute(
            select(Category.name, func.count(Ticket.id))
            .join(Ticket, Ticket.category_id == Category.id)
            .group_by(Category.name)
        )

        return result.all()

    async def get_queue_summary_counts(
        self,
        db: AsyncSession,
        current_user_id: UUID,
        now: datetime,
        sla_hours: dict[TicketPriority, int],
    ):
        overdue_condition = and_(
            self.model.status.in_(ACTIVE_STATUSES),
            or_(
                and_(
                    self.model.priority == TicketPriority.URGENT,
                    self.model.created_at
                    < now - timedelta(
                        hours=sla_hours[TicketPriority.URGENT]
                    ),
                ),
                and_(
                    self.model.priority == TicketPriority.HIGH,
                    self.model.created_at
                    < now - timedelta(
                        hours=sla_hours[TicketPriority.HIGH]
                    ),
                ),
                and_(
                    self.model.priority == TicketPriority.MEDIUM,
                    self.model.created_at
                    < now - timedelta(
                        hours=sla_hours[TicketPriority.MEDIUM]
                    ),
                ),
                and_(
                    self.model.priority == TicketPriority.LOW,
                    self.model.created_at
                    < now - timedelta(
                        hours=sla_hours[TicketPriority.LOW]
                    ),
                ),
            ),
        )

        query = select(
            func.sum(
                case(
                    (
                        and_(
                            self.model.assignee_id.is_(None),
                            self.model.status.in_(ACTIVE_STATUSES),
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label("unassigned"),

            func.sum(
                case(
                    (
                        and_(
                            self.model.assignee_id == current_user_id,
                            self.model.status.in_(ACTIVE_STATUSES),
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label("assigned_to_me"),

            func.sum(
                case(
                    (overdue_condition, 1),
                    else_=0,
                )
            ).label("overdue"),
        )

        return (await db.execute(query)).one()

ticket_crud = CRUDTicket(Ticket)