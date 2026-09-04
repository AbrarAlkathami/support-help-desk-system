from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.comment import comment_crud
from backend.models import Ticket, TicketComment, User
from backend.schemas.comment import CommentCreate


async def create_comment(
    db: AsyncSession,
    ticket: Ticket,
    author: User,
    data: CommentCreate,
) -> TicketComment:
    comment = await comment_crud.create(
        db,
        {
            "ticket_id": ticket.id,
            "author_id": author.id,
            "body": data.body,
        },
    )

    await db.commit()

    return comment


async def list_ticket_comments(db: AsyncSession, ticket: Ticket) -> list[TicketComment]:
    return await comment_crud.get_by_ticket(db, ticket.id)