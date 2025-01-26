import { verifyToken } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new Error("No token");
    }

    const decodedToken = verifyToken(token);

    const companyId = prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    const { projectName } = await req.json();

    // prisma.project.create({
    //   data: {
    //     name: projectName,
    //     companyId: companyId,
    //   },
    // });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
