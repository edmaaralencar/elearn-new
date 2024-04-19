import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Users {
  created_at: Generated<string>;
  email: string;
  email_verified: string | null;
  id: Generated<number | null>;
  name: string;
  password: string;
  role: Generated<string>;
}

export interface VerificationCodes {
  code: number;
  email: string;
  expires_at: string;
  id: Generated<number | null>;
}

export interface DB {
  users: Users;
  verification_codes: VerificationCodes;
}
