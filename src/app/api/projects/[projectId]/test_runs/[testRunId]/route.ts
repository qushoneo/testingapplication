import TestRunController from "@/app/api/controllers/TestRunController";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/projects/{projectId}/test_runs/{testRunId}:
 *   get:
 *     summary: Получить детальную информацию о тест-ране
 *     tags: [Test Runs]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID проекта (используется только для структуры URL)
 *       - in: path
 *         name: testRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID тест-рана (основной параметр для поиска)
 *     responses:
 *       200:
 *         description: Детальная информация о тест-ране с результатами
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/TestRun'
 *                 - type: object
 *                   properties:
 *                     testCaseRuns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           testRunId:
 *                             type: integer
 *                           testCaseId:
 *                             type: integer
 *                           status:
 *                             type: string
 *                             enum: [passed, failed, untested, skipped]
 *                           comment:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           testCase:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               severity:
 *                                 type: string
 *                                 nullable: true
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                               projectId:
 *                                 type: integer
 *                               folderId:
 *                                 type: integer
 *       404:
 *         description: Тест-ран не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ testRunId: string }> }) {
  const { testRunId } = await params;

  const testRun = await TestRunController.getDetailedTestRun(Number(testRunId));

  return NextResponse.json(testRun);
}