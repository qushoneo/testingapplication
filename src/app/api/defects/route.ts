import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateValidationErrors } from "../lib/generateValidationErrors";
import DefectController from "../controllers/DefectController";
import { Severity } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     Defect:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - severity
 *         - authorId
 *         - testCaseRunId
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор дефекта
 *         name:
 *           type: string
 *           minLength: 4
 *           description: Название дефекта
 *         description:
 *           type: string
 *           description: Описание дефекта
 *         severity:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           description: Серьезность дефекта
 *         status:
 *           type: string
 *           enum: [open, resolved, closed]
 *           description: Статус дефекта
 *         authorId:
 *           type: integer
 *           description: ID автора дефекта
 *         assignedUserId:
 *           type: integer
 *           nullable: true
 *           description: ID назначенного пользователя
 *         testCaseRunId:
 *           type: integer
 *           description: ID выполнения тест-кейса
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата обновления
 *
 *     CreateDefectRequest:
 *       type: object
 *       required:
 *         - testCaseRunId
 *         - defects
 *       properties:
 *         testCaseRunId:
 *           type: integer
 *           description: ID выполнения тест-кейса
 *         defects:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - severity
 *               - authorId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 description: Название дефекта
 *               description:
 *                 type: string
 *                 description: Описание дефекта
 *               severity:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 description: Серьезность дефекта
 *               authorId:
 *                 type: integer
 *                 description: ID автора дефекта
 *               assignedUserId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID назначенного пользователя
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Сообщение об ошибке
 *         field:
 *           type: string
 *           description: Поле с ошибкой
 */

const createDefectSchema = z.object({
  testCaseRunId: z.number(),
  defects: z.array(
    z.object({
      name: z.string().min(4, { message: "At least 4 symbols" }),
      description: z
        .string()
        .optional()
        .transform((val) => val ?? ""),
      severity: z.nativeEnum(Severity),
      authorId: z.number(),
      assignedUserId: z
        .number()
        .nullable()
        .optional()
        .transform((val) => val ?? null),
    })
  ),
});

/**
 * @swagger
 * /api/defects:
 *   post:
 *     summary: Создать дефекты для выполнения тест-кейса
 *     description: Создает один или несколько дефектов, связанных с конкретным выполнением тест-кейса
 *     tags:
 *       - Defects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDefectRequest'
 *           example:
 *             testCaseRunId: 123
 *             defects:
 *               - name: "Кнопка не работает"
 *                 description: "Кнопка 'Отправить' не реагирует на клик"
 *                 severity: "HIGH"
 *                 authorId: 1
 *                 assignedUserId: 2
 *               - name: "Неправильный цвет"
 *                 description: "Цвет заголовка не соответствует макету"
 *                 severity: "LOW"
 *                 authorId: 1
 *     responses:
 *       200:
 *         description: Дефекты успешно созданы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Количество созданных дефектов
 *             example:
 *               count: 2
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             example:
 *               - message: "At least 4 symbols"
 *                 field: "name"
 *       500:
 *         description: Внутренняя ошибка сервера
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = createDefectSchema.safeParse(body);

  if (!validation.success) {
    return generateValidationErrors(validation.error.errors);
  }

  const { testCaseRunId, defects } = validation.data;

  const defect = await DefectController.createBulk(
    defects.map((defect) => ({
      ...defect,
    })),
    testCaseRunId
  );

  return NextResponse.json(defect);
}

/**
 * @swagger
 * /api/defects:
 *   get:
 *     summary: Получить дефекты по ID выполнения тест-кейса
 *     description: Возвращает все дефекты, связанные с конкретным выполнением тест-кейса
 *     tags:
 *       - Defects
 *     parameters:
 *       - in: query
 *         name: testCaseRunId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID выполнения тест-кейса
 *         example: 123
 *     responses:
 *       200:
 *         description: Список дефектов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Defect'
 *             example:
 *               - id: 1
 *                 name: "Кнопка не работает"
 *                 description: "Кнопка 'Отправить' не реагирует на клик"
 *                 severity: "HIGH"
 *                 status: "open"
 *                 authorId: 1
 *                 assignedUserId: 2
 *                 testCaseRunId: 123
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *               - id: 2
 *                 name: "Неправильный цвет"
 *                 description: "Цвет заголовка не соответствует макету"
 *                 severity: "LOW"
 *                 status: "open"
 *                 authorId: 1
 *                 assignedUserId: null
 *                 testCaseRunId: 123
 *                 createdAt: "2024-01-15T10:35:00Z"
 *                 updatedAt: "2024-01-15T10:35:00Z"
 *       400:
 *         description: Отсутствует обязательный параметр
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке
 *             example:
 *               message: "Parameter testCaseRunId is required"
 *       500:
 *         description: Внутренняя ошибка сервера
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testCaseRunId = searchParams.get("testCaseRunId");

  if (!testCaseRunId) {
    return new NextResponse(
      JSON.stringify({ message: "Parameter testCaseRunId is required" }),
      { status: 400 }
    );
  }

  const defects = await DefectController.getDefectsByTestCaseRunId(
    Number(testCaseRunId)
  );

  return NextResponse.json(defects, { status: 200 });
}
