import { NextRequest, NextResponse } from "next/server";
import TestRunController from "@/app/api/controllers/TestRunController";
import { z } from "zod";
import { generateValidationErrors } from "@/app/api/lib/generateValidationErrors";
import { TestRun } from "@prisma/client";

const createTestRunSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 symbols" })
    .max(30, { message: "Name must be less than 30 symbols" }),
  projectId: z.number(),
  userId: z.number(),
  testPlanId: z.number(),
  status: z.string(),
  testCaseIds: z.array(z.number()),
});

const editTestRunSchema = z.object({
  testRunId: z.number(),
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 symbols" })
    .max(30, { message: "Name must be less than 30 symbols" })
    .optional(),
  projectId: z.number().optional(),
  userId: z.number().optional(),
  testPlanId: z.number().optional(),
  status: z.string().optional(),
  testCaseIds: z.array(z.number()).optional(),
});

/**
 * @swagger
 * /api/projects/{projectId}/test_runs:
 *   get:
 *     summary: Получить все тест-раны проекта
 *     tags: [Test Runs]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта
 *     responses:
 *       200:
 *         description: Список тест-ранов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestRun'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const testRuns = await TestRunController.getAll(Number(projectId));

  return NextResponse.json(testRuns);
}

/**
 * @swagger
 * /api/projects/{projectId}/test_runs:
 *   post:
 *     summary: Создать новый тест-ран
 *     tags: [Test Runs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projectId
 *               - userId
 *               - testPlanId
 *               - status
 *               - testCaseIds
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 30
 *               projectId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               testPlanId:
 *                 type: integer
 *               status:
 *                 type: string
 *               testCaseIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Созданный тест-ран
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestRun'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = createTestRunSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const testRun = await TestRunController.create(
    validation.data as Pick<
      TestRun,
      "name" | "projectId" | "userId" | "testPlanId" | "status"
    >,
    validation.data.testCaseIds
  );

  if (!testRun) {
    return NextResponse.json(
      { error: "Failed to create test run" },
      { status: 500 }
    );
  }

  return NextResponse.json(testRun);
}

/**
 * @swagger
 * /api/projects/{projectId}/test_runs:
 *   delete:
 *     summary: Массовое удаление тест-ранов
 *     tags: [Test Runs]
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
 *               - testRunIds
 *             properties:
 *               testRunIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Массив ID тест-ранов для удаления
 *     responses:
 *       200:
 *         description: Результат удаления
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Количество удаленных записей
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { testRunIds } = body;

    await TestRunController.bulkDelete(testRunIds);

    return NextResponse.json({ message: "Test runs deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete test runs" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/projects/{projectId}/test_runs/{testRunId}:
 *   patch:
 *     summary: Обновить тест-ран
 *     tags: [Test Runs]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта
 *       - in: path
 *         name: testRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID тест-рана
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 30
 *                 description: Новое название тест-рана
 *               projectId:
 *                 type: integer
 *                 description: ID проекта
 *               userId:
 *                 type: integer
 *                 description: ID пользователя
 *               testPlanId:
 *                 type: integer
 *                 description: ID тест-плана
 *               status:
 *                 type: string
 *                 enum: [passed, inProgress, failed, untested, skipped]
 *                 description: Статус тест-рана
 *               testCaseIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Массив ID тест-кейсов
 *     responses:
 *       200:
 *         description: Обновленный тест-ран
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestRun'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ testRunId: number }> }
) {
  const { testRunId } = await params;

  const body = await req.json();

  const validation = editTestRunSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const testRun = await TestRunController.update(
    body.testRunId,
    validation.data as Pick<
      TestRun,
      "name" | "projectId" | "userId" | "testPlanId" | "status"
    >,
    validation.data.testCaseIds
  );

  return NextResponse.json(testRun);
}
