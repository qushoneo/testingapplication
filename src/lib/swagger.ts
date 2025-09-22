import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Testing Application API',
      version: '1.0.0',
      description: 'API документация для приложения тестирования',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://your-domain.com',
        description: process.env.NODE_ENV === 'development' ? 'Development server' : 'Production server',
      },
    ],
    components: {
      schemas: {
        TestRun: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            userId: { type: 'integer' },
            projectId: { type: 'integer' },
            testPlanId: { type: 'integer', nullable: true },
            status: { 
              type: 'string',
              enum: ['passed', 'inProgress', 'failed', 'untested', 'skipped']
            },
            createdAt: { type: 'string', format: 'date-time' },
            duration: { type: 'integer', nullable: true }
          }
        },
        TestCase: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            severity: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              nullable: true
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        TestPlan: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            companyId: { type: 'integer' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/app/api/**/*.ts'], // путь к файлам с API эндпоинтами
};

const specs = swaggerJSDoc(options);
export default specs;
