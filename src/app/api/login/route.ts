import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { userToDTO } from "../lib/userTransferObject";
import { z } from "zod";
import { generateValidationErrors } from "../lib/generateValidationErrors";
import UserController from "../controllers/UserController";

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Авторизует пользователя с помощью email и пароля, возвращает JWT токен и информацию о пользователе
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: password123
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Устанавливается HTTP-only cookie с JWT токеном
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/; Max-Age=2592000
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               emailNotFound:
 *                 value: [{"field": "email", "message": "Cannot find email"}]
 *               invalidPassword:
 *                 value: [{"field": "password", "message": "Invalid password"}]
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { email, password } = validation.data;

    const user = await UserController.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        [{ field: "email", message: "Cannot find email" }],
        { status: 401 }
      );
    }

    const isPasswordValid = await UserController.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        [{ field: "password", message: "Invalid password" }],
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, companyId: user.companyId },
      process.env.JWT_SECRET || "jwt-secret-key-2025",
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
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
