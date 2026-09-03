from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column , relationship

from backend.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.models.ticket import Ticket


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    tickets: Mapped[list["Ticket"]] = relationship(
    back_populates="category",
    )