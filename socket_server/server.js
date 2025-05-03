import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { endpoints } from '../src/app/api/lib/clientEndpoints.js';
import { sendToAllClients } from './sendToClient.js';
import { sendToCompany } from './sendToCompany.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    switch (true) {
      case req.method === 'POST' &&
        req.url === `/api/${endpoints.CREATE_PROJECT}`:
        sendToCompany(req, res, io, endpoints.CREATE_PROJECT);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.DELETE_PROJECT}`:
        sendToCompany(req, res, io, endpoints.DELETE_PROJECT);
        break;

      case req.method === 'POST' &&
        req.url === `/api/${endpoints.ADD_NOTIFICATION}`:
        sendToCompany(req, res, io, endpoints.ADD_NOTIFICATION);
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
    socket.on('register', (companyId) => {
      socket.join(`company:${companyId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
