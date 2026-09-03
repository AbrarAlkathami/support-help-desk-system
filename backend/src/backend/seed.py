import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.common.enums import UserRole
from backend.core.security import hash_password
from backend.db.session import AsyncSessionLocal
from backend.common.enums import (
    TicketPriority,
    TicketStatus,
    UserRole,
)
from backend.models import Category, Ticket, TicketComment, User

async def seed_users(session: AsyncSession):
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
        result = await session.execute(
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

            session.add(user)
            print(f"[created] user: {data['name']}")
        else:
            print(f"[exists] user: {data['name']}")

        users[data["email"]] = user

    await session.flush()

    return users


async def seed_categories(session: AsyncSession):
    category_names = [
        "IT - Hardware",
        "IT - Access & VPN",
        "HR - Payroll",
    ]

    categories = {}

    for name in category_names:
        result = await session.execute(
            select(Category).where(Category.name == name)
        )

        category = result.scalar_one_or_none()

        if category is None:
            category = Category(name=name)
            session.add(category)

            print(f"[created] category: {name}")
        else:
            print(f"[exists] category: {name}")

        categories[name] = category

    await session.flush()

    return categories

async def seed_tickets(
    session: AsyncSession,
    users: dict,
    categories: dict,
):
    tickets_data = [
        {
            "subject": "VPN won't connect from home",
            "description": "Unable to connect to the corporate VPN while working remotely.",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.HIGH,
            "category": "IT - Access & VPN",
            "requester": "jordan@pwc.com",
            "assignee": None,
        },
        {
            "subject": "Laptop battery not charging",
            "description": "The laptop only works while connected to the charger.",
            "status": TicketStatus.IN_PROGRESS,
            "priority": TicketPriority.MEDIUM,
            "category": "IT - Hardware",
            "requester": "jordan@pwc.com",
            "assignee": "sam@pwc.com",
        },
        {
            "subject": "Incorrect payroll amount",
            "description": "The salary amount appears different from the expected amount.",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.URGENT,
            "category": "HR - Payroll",
            "requester": "jordan@pwc.com",
            "assignee": "priya@pwc.com",
        },
        {
            "subject": "Need access to shared drive",
            "description": "I cannot access the shared drive used by my team.",
            "status": TicketStatus.RESOLVED,
            "priority": TicketPriority.LOW,
            "category": "IT - Access & VPN",
            "requester": "jordan@pwc.com",
            "assignee": "sam@pwc.com",
        },
        {
            "subject": "Laptop screen keeps flickering",
            "description": "The laptop screen flickers several times during the day.",
            "status": TicketStatus.IN_PROGRESS,
            "priority": TicketPriority.HIGH,
            "category": "IT - Hardware",
            "requester": "jordan@pwc.com",
            "assignee": "priya@pwc.com",
        },
        {
            "subject": "Payslip is missing",
            "description": "The latest payslip is not visible in the HR system.",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.MEDIUM,
            "category": "HR - Payroll",
            "requester": "jordan@pwc.com",
            "assignee": None,
        },
        {
            "subject": "VPN disconnects frequently",
            "description": "The VPN disconnects every few minutes while working.",
            "status": TicketStatus.CLOSED,
            "priority": TicketPriority.HIGH,
            "category": "IT - Access & VPN",
            "requester": "jordan@pwc.com",
            "assignee": "sam@pwc.com",
        },
        {
            "subject": "Request for a second monitor",
            "description": "A second monitor is needed for the workstation.",
            "status": TicketStatus.OPEN,
            "priority": TicketPriority.LOW,
            "category": "IT - Hardware",
            "requester": "jordan@pwc.com",
            "assignee": None,
        },
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

        result = await session.execute(
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

            session.add(ticket)
            print(f"[created] ticket: {data['subject']}")
        else:
            print(f"[exists] ticket: {data['subject']}")

        tickets[data["subject"]] = ticket

    await session.flush()

    return tickets

async def seed_comments(
    session: AsyncSession,
    users: dict,
    tickets: dict,
):
    comments_data = [
        {
            "ticket": "VPN won't connect from home",
            "author": "jordan@pwc.com",
            "body": "The issue is still happening this morning.",
        },
        {
            "ticket": "VPN won't connect from home",
            "author": "sam@pwc.com",
            "body": "Thanks, I am checking the VPN configuration.",
        },
        {
            "ticket": "Laptop battery not charging",
            "author": "jordan@pwc.com",
            "body": "The battery is now at 0% and the laptop turns off when unplugged.",
        },
        {
            "ticket": "Laptop battery not charging",
            "author": "sam@pwc.com",
            "body": "We will arrange a hardware inspection.",
        },
    ]

    for data in comments_data:
        ticket = tickets[data["ticket"]]
        author = users[data["author"]]

        result = await session.execute(
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

            session.add(comment)
            print(f"[created] comment: {data['ticket']}")
        else:
            print(f"[exists] comment: {data['ticket']}")

    await session.flush()
    
async def seed():
    async with AsyncSessionLocal() as session:
        users = await seed_users(session)
        categories = await seed_categories(session)

        tickets = await seed_tickets(
            session,
            users,
            categories,
        )

        await seed_comments(
            session,
            users,
            tickets,
        )

        await session.commit()

    print("Seed completed.")

if __name__ == "__main__":
    asyncio.run(seed())