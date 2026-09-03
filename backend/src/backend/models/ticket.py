from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.common.enums import TicketPriority, TicketStatus
from backend.db.base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.models.user import User
    from backend.models.category import Category
    from backend.models.ticket_comment import TicketComment




class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    subject: Mapped[str] = mapped_column(String(200))

    description: Mapped[str] = mapped_column(Text)

    status: Mapped[TicketStatus] = mapped_column(
        default=TicketStatus.OPEN,
    )

    priority: Mapped[TicketPriority] = mapped_column(
        default=TicketPriority.MEDIUM,
    )

    category_id: Mapped[UUID] = mapped_column(
        ForeignKey("categories.id"),
    )

    requester_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
    )

    assignee_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    requester: Mapped["User"] = relationship(
    back_populates="requested_tickets",
    foreign_keys=[requester_id],
    )

    assignee: Mapped[Optional["User"]] = relationship(
        back_populates="assigned_tickets",
        foreign_keys=[assignee_id],
    )

    category: Mapped["Category"] = relationship(
        back_populates="tickets",
    )

    comments: Mapped[list["TicketComment"]] = relationship(
        back_populates="ticket",
    )