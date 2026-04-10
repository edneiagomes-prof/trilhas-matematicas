import { SessionOptions } from "iron-session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET deve ser definida com pelo menos 32 caracteres"
    );
  }
  return secret;
}

export const sessionOptions: SessionOptions = {
  get password() {
    return getSecret();
  },
  cookieName: "trilhas-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export interface SessionData {
  userId?: number;
  username?: string;
  name?: string;
  role?: string;
  turmaId?: number | null;
  nivel?: number | null;
}
