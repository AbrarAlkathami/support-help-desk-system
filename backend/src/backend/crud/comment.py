from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.crud.base import CRUDBase
from backend.models import TicketComment


class CRUDComment(CRUDBase[TicketComment]):
    async def get_by_ticket(self, db: AsyncSession, ticket_id: UUID) -> list[TicketComment]:

        result = await db.execute(
            select(TicketComment)
            .options(selectinload(TicketComment.author))
            .where(TicketComment.ticket_id == ticket_id)
            .order_by(TicketComment.created_at.asc())
        )
        return list(result.scalars().all())


comment_crud = CRUDComment(TicketComment)