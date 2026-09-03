from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.models.ticket import Ticket
    from backend.models.user import User


class TicketComment(Base):
    __tablename__ = "ticket_comments"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    ticket_id: Mapped[UUID] = mapped_column(
        ForeignKey("tickets.id"),
    )

    author_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
    )

    body: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    ticket: Mapped["Ticket"] = relationship(
    back_populates="comments",
    )

    author: Mapped["User"] = relationship(
        back_populates="comments",
    )