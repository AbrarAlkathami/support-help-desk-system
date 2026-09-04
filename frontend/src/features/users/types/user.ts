export type UserRole = "user" | "moderator" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};