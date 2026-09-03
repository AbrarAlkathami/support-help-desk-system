from collections.abc import Callable

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.common.enums import UserRole
from backend.db.dependencies import get_db
from backend.models import User
from backend.services.auth import get_user_from_token


async def get_current_user(access_token: str | None = Cookie(default=None), db: AsyncSession = Depends(get_db)) -> User:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = await get_user_from_token(db, access_token)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    return user


def require_roles(*allowed_roles: UserRole) -> Callable:
    async def check_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )

        return current_user

    return check_role


require_admin = require_roles(
    UserRole.ADMIN,
)

require_moderator_or_admin = require_roles(
    UserRole.MODERATOR,
    UserRole.ADMIN,
)