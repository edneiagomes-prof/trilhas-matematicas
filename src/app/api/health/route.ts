import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    SESSION_SECRET: !!(
      process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32
    ),
    NODE_ENV: process.env.NODE_ENV ?? "undefined",
  };

  const ok = checks.DATABASE_URL && checks.SESSION_SECRET;

  return NextResponse.json(
    { status: ok ? "ok" : "degraded", checks },
    { status: ok ? 200 : 503 }
  );
}
