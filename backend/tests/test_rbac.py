import pytest


async def login(client, email: str):
    response = await client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "Password123!",
        },
    )

    assert response.status_code == 200

@pytest.mark.asyncio
async def test_user_cannot_view_another_users_ticket(client, seed_data):
    await login(client, "user1@test.com")

    ticket = seed_data["ticket"]

    response = await client.get(
        f"/tickets/{ticket.id}"
    )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_user_cannot_update_ticket(client, seed_data):
    await login(client, "user1@test.com")

    ticket = seed_data["ticket"]

    response = await client.patch(
        f"/tickets/{ticket.id}",
        json={
            "priority": "high",
        },
    )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_moderator_can_update_ticket(client, seed_data):
    await login(client, "moderator@test.com")

    ticket = seed_data["ticket"]

    response = await client.patch(
        f"/tickets/{ticket.id}",
        json={
            "priority": "high",
        },
    )

    assert response.status_code == 200
    assert response.json()["priority"] == "high"


@pytest.mark.asyncio
async def test_moderator_cannot_delete_ticket(client, seed_data):
    await login(client, "moderator@test.com")

    ticket = seed_data["ticket"]

    response = await client.delete(
        f"/tickets/{ticket.id}"
    )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_can_delete_ticket(client, seed_data):
    await login(client, "admin@test.com")

    ticket = seed_data["ticket"]

    response = await client.delete(
        f"/tickets/{ticket.id}"
    )

    assert response.status_code == 204


@pytest.mark.asyncio
async def test_user_cannot_create_category(client, seed_data):
    await login(client, "user1@test.com")

    response = await client.post(
        "/categories",
        json={
            "name": "Finance",
        },
    )

    assert response.status_code == 403