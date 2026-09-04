from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth_dependencies import (
    require_admin,
    require_moderator_or_admin,
)
from backend.common.enums import UserRole
from backend.crud.user import user_crud
from backend.db.dependencies import get_db
from backend.models import User
from backend.schemas.user import UserCreate, UserResponse, UserUpdate
from backend.services.user import create_user, update_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/moderators",
    response_model=list[UserResponse],
)
async def get_moderators(
    _current_user: User = Depends(require_moderator_or_admin),
    db: AsyncSession = Depends(get_db),
):
    return await user_crud.get_by_role(db, UserRole.MODERATOR)


@router.get("", response_model=list[UserResponse])
async def get_users(
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await user_crud.get_all(db)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_user(
    data: UserCreate,
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await create_user(db, data)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: UUID,
    data: UserUpdate,
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    user = await update_user(db, user_id, data)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user