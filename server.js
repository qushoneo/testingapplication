import { createServer } from 'http';
import next from 'next';
import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io'; // Правильный импорт

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('DELETE_PROJECT', async (data) => {
      const { companyId } = data;
      await prisma.project.deleteMany({
        where: {
          id: { in: data.projectIds },
        },
      });

      const updatedProjects = await getProjectsFromDB(companyId);
      io.emit('PROJECT_UPDATED', updatedProjects);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  });

  async function getProjectsFromDB(companyId) {
    return await prisma.project.findMany({
      where: {
        companyId: companyId,
      },
    });
  }

  server.listen(port, () => {
    console.log('server started on port 3000');
  });
});
