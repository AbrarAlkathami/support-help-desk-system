from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.base import CRUDBase
from backend.models import Category


class CRUDCategory(CRUDBase[Category]):
    async def get_by_name(self, db: AsyncSession, name: str) -> Category | None:
        result = await db.execute(
            select(Category).where(Category.name == name)
        )

        return result.scalar_one_or_none()


category_crud = CRUDCategory(Category)