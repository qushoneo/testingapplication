import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userToDTO } from "../lib/userTransferObject";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key-2025";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { errors: [{ field: "email", message: "Cannot find email" }] },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { errors: [{ field: "password", message: "Invalid password" }] },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, companyId: user.companyId },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const response = NextResponse.json(
      { user: userToDTO(user), token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
