from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth_dependencies import get_current_user, require_admin
from backend.crud.category import category_crud
from backend.db.dependencies import get_db
from backend.models import User
from backend.schemas.category import CategoryCreate, CategoryResponse
from backend.services.category import create_category


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    _current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await category_crud.get_all(db)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_category(
    data: CategoryCreate,
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await create_category(db, data)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )