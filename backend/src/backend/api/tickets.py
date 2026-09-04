from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Annotated

from backend.db.dependencies import get_db
from backend.models import User
from backend.schemas.ticket import ( 
    TicketCreate, 
    TicketResponse, 
    TicketListResponse, 
    TicketFilters , 
    TicketUpdate, 
    TicketDetailResponse, 
    )
from backend.services.ticket import (
    can_access_ticket,
    create_ticket,
    get_ticket,
    close_ticket,
    list_tickets,
    update_ticket,
)
from backend.api.auth_dependencies import (
    get_current_user,
    require_moderator_or_admin,
    require_admin,
)
from backend.services.comment import list_ticket_comments, create_comment
from backend.schemas.comment import CommentCreate, CommentResponse

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_new_ticket(
    data: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ticket = await create_ticket(db, data, current_user)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return ticket


@router.get("", response_model=TicketListResponse)
async def get_tickets(
    filters: Annotated[TicketFilters, Query()],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    tickets, total = await list_tickets(db, current_user, filters)

    return {
        "items": tickets,
        "total": total,
        "page": filters.page,
        "page_size": filters.page_size,
    }

@router.get("/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket_by_id(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ticket = await get_ticket(db, ticket_id)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    if not can_access_ticket(ticket, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this ticket",
        )

    comments = await list_ticket_comments(db, ticket)

    ticket_data = TicketResponse.model_validate(ticket).model_dump()

    return TicketDetailResponse(
        **ticket_data,
        comments=comments,
    )

@router.post(
    "/{ticket_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_ticket_comment(
    ticket_id: UUID,
    data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ticket = await get_ticket(db, ticket_id)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    if not can_access_ticket(ticket, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to comment on this ticket",
        )

    return await create_comment(db, ticket, current_user, data)


@router.patch("/{ticket_id}", response_model=TicketResponse)
async def update_ticket_by_id(
    ticket_id: UUID,
    data: TicketUpdate,
    _current_user: User = Depends(require_moderator_or_admin),
    db: AsyncSession = Depends(get_db),
):
    try:
        ticket = await update_ticket(db, ticket_id, data)

    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return ticket


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_ticket(
    ticket_id: UUID,
    _current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    ticket = await close_ticket(db, ticket_id)

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )