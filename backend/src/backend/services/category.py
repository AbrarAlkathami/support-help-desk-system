from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.category import category_crud
from backend.models import Category
from backend.schemas.category import CategoryCreate


async def create_category(db: AsyncSession, data: CategoryCreate) -> Category:
    existing_category = await category_crud.get_by_name(db, data.name)

    if existing_category is not None:
        raise ValueError("Category already exists")

    category = await category_crud.create(
        db,
        data.model_dump(),
    )

    await db.commit()

    return category