const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function deleteTicket(
  ticketId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/tickets/${ticketId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (response.ok) {
    return;
  }

  let message = "Could not close ticket.";

  try {
    const data = await response.json();

    message =
      data?.error?.message ??
      data?.detail ??
      message;
  } catch {

  }

  throw new Error(message);
}