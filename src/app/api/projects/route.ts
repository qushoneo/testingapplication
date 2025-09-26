import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../lib/getCompanyIdFromToken";
import ProjectController from "../controllers/ProjectController";
import { z } from "zod";
import { generateValidationErrors } from "../lib/generateValidationErrors";
import { endpoints } from "../lib/clientEndpoints";
import SocketServices from "../services/socketServices";
import NotificationController from "../controllers/NotificationController";

// Projects Endpoints

const createProjectSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Project name requires at least 4 characters" }),
});

/**
 * @swagger
 * /api/projects:
 *   delete:
 *     summary: Массовое удаление проектов
 *     description: Удаляет несколько проектов по их ID. Требует аутентификации.
 *     tags: [Projects]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectIds
 *             properties:
 *               projectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Массив ID проектов для удаления
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Проекты успешно удалены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: ID удаленных проектов
 *       500:
 *         description: Ошибка при удалении
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(req: NextRequest) {
  try {
    const { projectIds } = await req.json();

    const token = req.cookies.get("token")?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    await ProjectController.deleteProject(projectIds);

    await SocketServices.sendToSocket(
      { projectIds: projectIds, companyId: companyId },
      endpoints.DELETE_PROJECT
    );

    return NextResponse.json(
      {
        projectIds,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Получить все проекты компании
 *     description: Возвращает список всех проектов, принадлежащих компании пользователя
 *     tags: [Projects]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список проектов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       403:
 *         description: Нет токена авторизации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Don't have token
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      NextResponse.json({ message: "Don't have token" }, { status: 403 });
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      throw new Error("Cannot find company id");
    }

    const projects = await ProjectController.getAllProjects(companyId);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error -" + error }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Создать новый проект
 *     description: Создает новый проект в компании пользователя, отправляет уведомление и обновляет всех пользователей компании через WebSocket
 *     tags: [Projects]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 description: Название проекта (минимум 4 символа)
 *                 example: Мой новый проект
 *     responses:
 *       201:
 *         description: Проект успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Ошибка валидации или имя проекта уже используется
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               nameInUse:
 *                 value: [{"field": "name", "message": "Project name already in use"}]
 *               validation:
 *                 value: [{"field": "name", "message": "Project name requires at least 4 characters"}]
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

    const { companyId, id } = await getCompanyIdFromToken(token);

    const body = (await req.json()) as { name: string; companyId: number };

    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { name } = validation.data;

    const existingProject = await ProjectController.findProjectByName(
      name,
      companyId!
    );

    if (existingProject) {
      return NextResponse.json(
        [
          {
            field: "name",
            message: "Project name already in use",
          },
        ],
        { status: 400 }
      );
    }

    const newProject = await ProjectController.createProject(name, companyId!);

    await NotificationController.create({
      message: `Project ${newProject.name} has been successfully created`,
      userId: Number(id),
    });

    await SocketServices.sendToSocket(
      { project: newProject, companyId: companyId },
      endpoints.CREATE_PROJECT_COMPANY
    );

    await SocketServices.sendToSocket(
      {
        userId: id,
      },
      endpoints.ADD_NOTIFICATION_USER
    );

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
