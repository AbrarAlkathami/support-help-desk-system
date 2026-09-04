from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.auth_dependencies import require_admin
from backend.db.dependencies import get_db
from backend.models import User
from backend.schemas.metrics import MetricsResponse
from backend.services.metrics import get_metrics


router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"],
)


@router.get("", response_model=MetricsResponse)
async def metrics(
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await get_metrics(db)