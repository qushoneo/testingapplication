import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Example authentication logic
  if (email === "test@example.com" && password === "password123") {
    return NextResponse.json({
      message: "Login successful",
      token: "dummy-token",
    });
  }

  return NextResponse.json(
    { message: "Invalid email or password" },
    { status: 401 }
  );
}
