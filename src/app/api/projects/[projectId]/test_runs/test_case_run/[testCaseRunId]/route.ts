import { NextRequest, NextResponse } from "next/server";

import { Status } from "@prisma/client";
import { z } from "zod";
import TestRunController from "@/app/api/controllers/TestRunController";
import { generateValidationErrors } from "@/app/api/lib/generateValidationErrors";

const updateTestCaseRunSchema = z.object({
  status: z.nativeEnum(Status),
});

/**
 * @swagger
 * /api/projects/{projectId}/test_runs/test_case_run/{testCaseRunId}:
 *   patch:
 *     summary: Обновить статус выполнения тест-кейса в тест-ране
 *     description: Обновляет статус выполнения конкретного тест-кейса в рамках тест-рана
 *     tags: [Test Case Runs]
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
 *       - in: path
 *         name: testCaseRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID выполнения тест-кейса
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [passed, failed, untested, skipped]
 *                 description: Новый статус выполнения тест-кейса
 *                 example: passed
 *     responses:
 *       200:
 *         description: Статус тест-кейса успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestCaseRun'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             example:
 *               - field: status
 *                 message: Invalid enum value. Expected 'passed' | 'failed' | 'untested' | 'skipped'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseRunId: string }> }
) {
  const { testCaseRunId } = await params;

  const body = await req.json();

  const validation = updateTestCaseRunSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const testCaseRun = await TestRunController.updateStatus(
    Number(testCaseRunId),
    validation.data.status as Status
  );

  return NextResponse.json(testCaseRun);
}
