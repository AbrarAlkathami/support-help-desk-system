import pytest_asyncio

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

from backend.core.security import hash_password
from backend.common.enums import UserRole
from backend.db.base import Base
from backend.db.dependencies import get_db
from backend.main import app
from backend.models import Category, Ticket, User


TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DATABASE_URL,
    poolclass=StaticPool,
)

TestSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture
async def db():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(db):
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def seed_data(db):
    user_one = User(
        name="User One",
        email="user1@test.com",
        password_hash=hash_password("Password123!"),
        role=UserRole.USER,
    )

    user_two = User(
        name="User Two",
        email="user2@test.com",
        password_hash=hash_password("Password123!"),
        role=UserRole.USER,
    )

    moderator = User(
        name="Moderator",
        email="moderator@test.com",
        password_hash=hash_password("Password123!"),
        role=UserRole.MODERATOR,
    )

    admin = User(
        name="Admin",
        email="admin@test.com",
        password_hash=hash_password("Password123!"),
        role=UserRole.ADMIN,
    )

    category = Category(name="IT")

    db.add_all([
        user_one,
        user_two,
        moderator,
        admin,
        category,
    ])

    await db.flush()

    ticket = Ticket(
        subject="Test ticket",
        description="Ticket owned by user two",
        requester_id=user_two.id,
        category_id=category.id,
    )

    db.add(ticket)
    await db.commit()

    return {
        "user_one": user_one,
        "user_two": user_two,
        "moderator": moderator,
        "admin": admin,
        "category": category,
        "ticket": ticket,
    }