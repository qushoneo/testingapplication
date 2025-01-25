import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
