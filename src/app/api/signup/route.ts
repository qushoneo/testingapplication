// app/api/signup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("success connection");
  try {
    const { name, email, password, jobTitle } = await req.json(); // Parse the request body

    if (!name || !email || !password || !jobTitle) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Simulate user creation (you can add actual DB logic here)
    const token = "generated-token"; // Example of a generated token, replace with actual logic

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
