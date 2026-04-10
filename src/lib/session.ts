import { SessionOptions } from "iron-session";

const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    "SESSION_SECRET deve ser definida com pelo menos 32 caracteres"
  );
}

export const sessionOptions: SessionOptions = {
  password: secret,
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
