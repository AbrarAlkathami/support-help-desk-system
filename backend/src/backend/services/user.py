from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import hash_password
from backend.crud.user import user_crud
from backend.models import User
from backend.schemas.user import UserCreate, UserUpdate


async def create_user(db: AsyncSession, data: UserCreate) -> User:
    existing_user = await user_crud.get_by_email(db, data.email)

    if existing_user is not None:
        raise ValueError("Email is already registered")

    user = await user_crud.create(
        db,
        {
            "name": data.name,
            "email": data.email.lower(),
            "password_hash": hash_password(data.password),
            "role": data.role,
        },
    )

    await db.commit()

    return user


async def update_user(
    db: AsyncSession,
    user_id: UUID,
    data: UserUpdate,
) -> User | None:
    user = await user_crud.get(db, user_id)

    if user is None:
        return None

    update_data = data.model_dump(exclude_unset=True)

    user = await user_crud.update(
        db,
        user,
        update_data,
    )

    await db.commit()

    return user