import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Testing Application API",
      version: "1.0.0",
      description: "API документация для приложения тестирования",
      contact: {
        name: "Testing Application Support",
        email: "support@testingapp.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://your-domain.com",
        description:
          process.env.NODE_ENV === "development"
            ? "Development server"
            : "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Эндпоинты для аутентификации и авторизации пользователей",
      },
      {
        name: "Projects",
        description: "Управление проектами",
      },
      {
        name: "Test Cases",
        description: "Управление тест-кейсами",
      },
      {
        name: "Test Runs",
        description: "Управление тест-ранами",
      },
      {
        name: "Test Case Runs",
        description: "Управление выполнением тест-кейсов в рамках тест-ранов",
      },
      {
        name: "Users",
        description: "Управление пользователями",
      },
      {
        name: "Bug Reports",
        description: "Отправка и просмотр баг-репортов",
      },
      {
        name: "Notifications",
        description: "Система уведомлений",
      },
      {
        name: "Invitations",
        description: "Приглашения пользователей в компанию",
      },
      {
        name: "Password Recovery",
        description: "Восстановление пароля",
      },
    ],
    security: [
      {
        cookieAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            jobTitle: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            companyId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Company: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            companyId: { type: "integer" },
          },
        },
        Folder: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            parentId: { type: "integer", nullable: true },
            projectId: { type: "integer" },
            companyId: { type: "integer" },
          },
        },
        TestCase: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            severity: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              nullable: true,
            },
            projectId: { type: "integer" },
            folderId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        TestPlan: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            projectId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        TestRun: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            userId: { type: "integer" },
            projectId: { type: "integer" },
            testPlanId: { type: "integer", nullable: true },
            status: {
              type: "string",
              enum: ["passed", "inProgress", "failed", "untested", "skipped"],
            },
            createdAt: { type: "string", format: "date-time" },
            duration: { type: "integer", nullable: true },
          },
        },
        TestCaseRun: {
          type: "object",
          properties: {
            id: { type: "integer" },
            testRunId: { type: "integer" },
            testCaseId: { type: "integer" },
            status: {
              type: "string",
              enum: ["passed", "failed", "untested", "skipped"],
            },
            comment: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Invitation: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            companyId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "integer" },
            message: { type: "string" },
            read: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Bug: {
          type: "object",
          properties: {
            id: { type: "integer" },
            text: { type: "string" },
            screenshot: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            field: { type: "string" },
            message: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/app/api/**/*.ts"], // путь к файлам с API эндпоинтами
};

const specs = swaggerJSDoc(options);
export default specs;
