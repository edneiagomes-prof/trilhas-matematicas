import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./session";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function requireTeacher() {
  const session = await getSession();
  if (!session.userId || session.role !== "teacher") {
    return null;
  }
  return session;
}

export async function requireStudent() {
  const session = await getSession();
  if (!session.userId || session.role !== "student") {
    return null;
  }
  return session;
}
