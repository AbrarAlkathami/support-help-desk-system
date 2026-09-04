from sqlalchemy.ext.asyncio import AsyncSession

from backend.crud.ticket import ticket_crud


async def get_metrics(db: AsyncSession) -> dict:
    total = await ticket_crud.count_all(db)
    status_rows = await ticket_crud.count_by_status(db)
    category_rows = await ticket_crud.count_by_category(db)

    return {
        "total_tickets": total,
        "by_status": [
            {"status": status, "count": count}
            for status, count in status_rows
        ],
        "by_category": [
            {"category": category, "count": count}
            for category, count in category_rows
        ],
    }