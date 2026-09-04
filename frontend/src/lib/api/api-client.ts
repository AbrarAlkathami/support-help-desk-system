const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error?.error?.message ||
        error?.detail ||
        "Something went wrong",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}