import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../lib/getCompanyIdFromToken";
import { generateValidationErrors } from "../lib/generateValidationErrors";
import { z } from "zod";
import mailController from "../lib/transporter";
import InvitationController from "../controllers/InvitationController";
import UserController from "../controllers/UserController";

const inviteUserSchema = z.object({
  email: z.string().email(),
});

/**
 * @swagger
 * /api/invite:
 *   post:
 *     summary: Пригласить пользователя в компанию
 *     description: Отправляет приглашение пользователю для присоединения к компании по email
 *     tags: [Invitations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя для приглашения
 *                 example: newuser@example.com
 *     responses:
 *       201:
 *         description: Приглашение успешно отправлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User invited
 *       400:
 *         description: Ошибка валидации или пользователь уже существует/приглашен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               userExists:
 *                 value: [{"field": "email", "message": "User with that email already exists"}]
 *               alreadyInvited:
 *                 value: [{"field": "email", "message": "This user already invited"}]
 *               validation:
 *                 value: [{"field": "email", "message": "Invalid email format"}]
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    const body = await req.json();

    const validation = inviteUserSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { email } = validation.data;

    const existingUser = await UserController.findByEmail(email);
    const existingInvitation = await InvitationController.getByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        [
          {
            field: "email",
            message: "User with that email already exists",
          },
        ],
        { status: 400 }
      );
    }

    if (existingInvitation) {
      return NextResponse.json(
        [
          {
            field: "email",
            message: "This user already invited",
          },
        ],
        { status: 400 }
      );
    }

    const invitation = await InvitationController.create(email, companyId!);

    mailController.sendMail({
      to: email,
      subject: "Invitation to join QA Application",
      text: `Click here to join QA Application: ${process.env.PUBLIC_APP_URL}/invite/${invitation.id}`,
    });

    return NextResponse.json({ message: "User invited" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
