from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies import get_db


router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check():
    return {"status": "Support Helpdesk API is running"}


@router.get("/db")
async def database_health_check(
    db: AsyncSession = Depends(get_db),
):
    try:
        await db.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "reachable",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        )