import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { endpoints } from '../src/app/api/lib/clientEndpoints.js';
import { sendToCompany } from './sendToCompany.js';
import { sendToUserId } from './sendToUserId.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    switch (true) {
      case req.method === 'POST' &&
        req.url === `/api/${endpoints.CREATE_PROJECT_COMPANY}`:
        sendToCompany(req, res, io, endpoints.CREATE_PROJECT_COMPANY);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.CREATE_PROJECT_USER}`:
        sendToUserId(req, res, io, endpoints.CREATE_PROJECT_USER);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.DELETE_PROJECT}`:
        sendToCompany(req, res, io, endpoints.DELETE_PROJECT);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.ADD_NOTIFICATION_COMPANY}`:
        sendToCompany(req, res, io, endpoints.ADD_NOTIFICATION_COMPANY);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.ADD_NOTIFICATION_USER}`:
        sendToUserId(req, res, io, endpoints.ADD_NOTIFICATION_USER);
        break;

      default:
        handler(req, res);
        break;
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('register', (user) => {
      socket.join(`company:${user.companyId}`);
      socket.join(`userId:${user.id}`);
    });
  });

  httpServer.listen(port, () => {});

  const HOUR = 1000 * 60;
  setInterval(async () => {
    const cutoff = new Date(Date.now() - HOUR);
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoff,
          },
          read: true,
        },
      });
      if (result.count > 0) {
        console.log(`[CLEANUP] Deleted ${result.count} old notifications`);
      } else {
        console.log(`[CLEANUP] Nothing to delete...`);
      }
    } catch (err) {
      console.error('[CLEANUP ERROR]', err);
    }
  }, HOUR);
});
