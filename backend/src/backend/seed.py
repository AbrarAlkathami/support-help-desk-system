import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.common.enums import TicketPriority, TicketStatus, UserRole
from backend.core.security import hash_password
from backend.db.session import AsyncSessionLocal
from backend.models import Category, Ticket, TicketComment, User


async def seed_users(db: AsyncSession):
    users_data = [
        {
            "name": "Amina Admin",
            "email": "admin@pwc.com",
            "password": "Admin123!",
            "role": UserRole.ADMIN,
        },
        {
            "name": "Sam Support",
            "email": "sam@pwc.com",
            "password": "Moderator123!",
            "role": UserRole.MODERATOR,
        },
        {
            "name": "Priya Agent",
            "email": "priya@pwc.com",
            "password": "Moderator123!",
            "role": UserRole.MODERATOR,
        },
        {
            "name": "Jordan Employee",
            "email": "jordan@pwc.com",
            "password": "User123!",
            "role": UserRole.USER,
        },
    ]

    users = {}

    for data in users_data:
        result = await db.execute(
            select(User).where(User.email == data["email"])
        )

        user = result.scalar_one_or_none()

        if user is None:
            user = User(
                name=data["name"],
                email=data["email"],
                password_hash=hash_password(data["password"]),
                role=data["role"],
            )

            db.add(user)
            print(f"[created] user: {data['name']}")
        else:
            print(f"[exists] user: {data['name']}")

        users[data["email"]] = user

    await db.flush()

    return users


async def seed_categories(db: AsyncSession):
    category_names = [
        "IT - Hardware",
        "IT - Access & VPN",
        "HR - Payroll",
    ]

    categories = {}

    for name in category_names:
        result = await db.execute(
            select(Category).where(Category.name == name)
        )

        category = result.scalar_one_or_none()

        if category is None:
            category = Category(name=name)
            db.add(category)

            print(f"[created] category: {name}")
        else:
            print(f"[exists] category: {name}")

        categories[name] = category

    await db.flush()

    return categories


async def seed_tickets(db: AsyncSession, users: dict, categories: dict):
    tickets_data = [
        # keep your existing tickets_data here
    ]

    tickets = {}

    for data in tickets_data:
        requester = users[data["requester"]]

        assignee = (
            users[data["assignee"]]
            if data["assignee"] is not None
            else None
        )

        category = categories[data["category"]]

        result = await db.execute(
            select(Ticket).where(
                Ticket.subject == data["subject"],
                Ticket.requester_id == requester.id,
            )
        )

        ticket = result.scalar_one_or_none()

        if ticket is None:
            ticket = Ticket(
                subject=data["subject"],
                description=data["description"],
                status=data["status"],
                priority=data["priority"],
                category_id=category.id,
                requester_id=requester.id,
                assignee_id=assignee.id if assignee else None,
            )

            db.add(ticket)
            print(f"[created] ticket: {data['subject']}")
        else:
            print(f"[exists] ticket: {data['subject']}")

        tickets[data["subject"]] = ticket

    await db.flush()

    return tickets


async def seed_comments(db: AsyncSession, users: dict, tickets: dict):
    comments_data = [
        # keep your existing comments_data here
    ]

    for data in comments_data:
        ticket = tickets[data["ticket"]]
        author = users[data["author"]]

        result = await db.execute(
            select(TicketComment).where(
                TicketComment.ticket_id == ticket.id,
                TicketComment.author_id == author.id,
                TicketComment.body == data["body"],
            )
        )

        comment = result.scalar_one_or_none()

        if comment is None:
            comment = TicketComment(
                ticket_id=ticket.id,
                author_id=author.id,
                body=data["body"],
            )

            db.add(comment)
            print(f"[created] comment: {data['ticket']}")
        else:
            print(f"[exists] comment: {data['ticket']}")

    await db.flush()


async def seed():
    async with AsyncSessionLocal() as db:
        users = await seed_users(db)
        categories = await seed_categories(db)
        tickets = await seed_tickets(db, users, categories)

        await seed_comments(db, users, tickets)

        await db.commit()

    print("Seed completed.")


if __name__ == "__main__":
    asyncio.run(seed())