from typing import Generic, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.base import Base


ModelType = TypeVar("ModelType", bound=Base)


class CRUDBase(Generic[ModelType]):
    
    def __init__(self, model: type[ModelType]):
        self.model = model

    async def get( self, db: AsyncSession, id: UUID ) -> ModelType | None:
        return await db.get(self.model, id)

    async def get_all( self, db: AsyncSession ) -> list[ModelType]:

        result = await db.execute(
            select(self.model)
        )

        return list(result.scalars().all())

    async def create( self, db: AsyncSession, data: dict ) -> ModelType:

        obj = self.model(**data)

        db.add(obj)

        await db.flush()
        await db.refresh(obj)

        return obj

    async def update( self, db: AsyncSession, obj: ModelType, data: dict ) -> ModelType:

        for key, value in data.items():
            setattr(obj, key, value)

        await db.flush()
        await db.refresh(obj)

        return obj

    async def delete( self, db: AsyncSession, id: UUID ) -> ModelType | None:

        obj = await db.get(self.model, id)

        if obj is None:
            return None

        await db.delete(obj)
        await db.flush()

        return obj