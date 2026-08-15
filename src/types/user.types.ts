export type UserRole = "admin" | "officer";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}