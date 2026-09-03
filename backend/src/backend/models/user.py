from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.common.enums import UserRole
from backend.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.models.ticket import Ticket
    from backend.models.ticket_comment import TicketComment

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(String(100))

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
    )

    password_hash: Mapped[str] = mapped_column(String(255))

    role: Mapped[UserRole] = mapped_column(
        default=UserRole.USER,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )


    requested_tickets: Mapped[list["Ticket"]] = relationship(
    back_populates="requester",
    foreign_keys="Ticket.requester_id",
    )

    assigned_tickets: Mapped[list["Ticket"]] = relationship(
        back_populates="assignee",
        foreign_keys="Ticket.assignee_id",
    )

    comments: Mapped[list["TicketComment"]] = relationship(
        back_populates="author",
    )