import TestCaseController from "@/app/api/controllers/TestCaseController";
import { generateValidationErrors } from "@/app/api/lib/generateValidationErrors";
import { Severity, TestCase } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TestCaseSchema = z.object({
  name: z.string().min(4, { message: "At least 4 symbols" }),
  description: z.string().optional(),
  severity: z.nativeEnum(Severity).nullable().optional(),
  folderId: z.number(),
});

/**
 * @swagger
 * /api/projects/{projectId}/test_cases:
 *   get:
 *     summary: Получить все тест-кейсы проекта
 *     description: Возвращает список всех тест-кейсов в указанном проекте
 *     tags: [Test Cases]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта
 *         example: 1
 *     responses:
 *       200:
 *         description: Список тест-кейсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestCase'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; folderId: string }> }
) {
  try {
    const { projectId } = await params;

    const testCases = await TestCaseController.getAll(Number(projectId));

    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/projects/{projectId}/test_cases:
 *   post:
 *     summary: Создать новый тест-кейс
 *     description: Создает новый тест-кейс в указанном проекте
 *     tags: [Test Cases]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - folderId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 description: Название тест-кейса
 *                 example: Проверка авторизации
 *               description:
 *                 type: string
 *                 description: Описание тест-кейса
 *                 example: Проверяем возможность входа в систему с валидными данными
 *               severity:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 nullable: true
 *                 description: Серьезность дефекта
 *                 example: HIGH
 *               folderId:
 *                 type: integer
 *                 description: ID папки, в которую добавляется тест-кейс
 *                 example: 1
 *     responses:
 *       201:
 *         description: Тест-кейс успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCase'
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
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const body = await req.json();
    const { projectId } = await params;
    const validation = TestCaseSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { name, description, severity, folderId } = validation.data;

    const newTestCase = TestCaseController.create(
      {
        name: name,
        description: description || "",
        severity: severity || null,
        folderId: folderId,
      },
      Number(projectId)
    );

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { folderId, ...testCase } = await req.json();
    const { testCaseId } = await params;

    const updatedTestCase = await TestCaseController.update(
      Number(testCaseId),
      testCase
    );

    return NextResponse.json(updatedTestCase, { status: 200 });
  } catch (error) {
    console.error("Error updating test case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { testCaseId } = await params;

    await TestCaseController.delete(Number(testCaseId));

    return NextResponse.json({ message: "Test case deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
