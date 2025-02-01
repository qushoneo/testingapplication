import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userToDTO } from "../lib/userTransferObject";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])/,
      "Password must contain at least 1 number and 1 special character"
    ),
  jobTitle: z.string().min(1, "Job title is required"),
  role: z.nativeEnum(Role).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, password, jobTitle, role } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { errors: [{ field: "email", message: "Email already in use" }] },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: { name: `${name.split(" "[0])}'s company` },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        jobTitle,
        companyId: company.id,
        role: role || Role.ADMIN,
      },
    });

    const token = jwt.sign(
      { id: user.id, companyId: user.companyId },
      process.env.JWT_SECRET || "jwt-secret-key-2025",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json(
      { token, user: userToDTO(user) },
      { status: 201 }
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
