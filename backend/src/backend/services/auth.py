from uuid import UUID

import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.security import decode_access_token, verify_password
from backend.crud.user import user_crud
from backend.models import User


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    user = await user_crud.get_by_email(db, email)

    if user is None:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


async def get_user_from_token(db: AsyncSession, token: str) -> User | None:
    try:
        payload = decode_access_token(token)
        user_id = UUID(payload["sub"])

    except (jwt.InvalidTokenError, KeyError, ValueError):
        return None

    return await user_crud.get(db, user_id)