import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userToDTO } from "../lib/userTransferObject";

const prisma = new PrismaClient();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export async function POST(req: Request) {
  try {
    const { name, email, password, jobTitle, role } = await req.json();

    let errors: { field: string; message: string }[] = [];

    if (!name) {
      errors.push({ field: "name", message: "Name is required" });
    }

    if (!email) {
      errors.push({ field: "email", message: "Email is required" });
    } else if (!emailRegex.test(email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }

    if (!password) {
      errors.push({ field: "password", message: "Password is required" });
    } else if (!passwordRegex.test(password)) {
      errors.push({
        field: "password",
        message:
          "Password must be at least 8 characters, with at least 1 number and 1 special character",
      });
    }

    if (!jobTitle) {
      errors.push({ field: "jobTitle", message: "Job title is required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      errors.push({ field: "email", message: "Email already in use" });
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        name: name + "'s company",
      },
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
      { id: user.id },
      process.env.JWT_SECRET || "jwt-secret-key-2025",
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token, user: userToDTO(user) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
