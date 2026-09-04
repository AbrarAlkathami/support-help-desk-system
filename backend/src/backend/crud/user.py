from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.base import CRUDBase
from backend.models import User
from backend.common.enums import UserRole

class CRUDUser(CRUDBase[User]):
    
    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        result = await db.execute(
            select(User).where(User.email == email.lower())
        )

        return result.scalar_one_or_none()

    async def get_by_role(self, db: AsyncSession, role: UserRole) -> list[User]:
        result = await db.execute(
            select(User)
            .where(User.role == role)
            .order_by(User.name)
        )

        return list(result.scalars().all())


user_crud = CRUDUser(User)