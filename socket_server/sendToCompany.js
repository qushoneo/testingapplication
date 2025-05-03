export const sendToCompany = (req, res, io, clientUrl) => {
  // io.to(`company:${companyId}`).emit('notification', { message });
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const companyId = data.data.companyId;

      console.log(`company:${companyId}`, data.data);

      io.to(`company:${companyId}`).emit(clientUrl, data.data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
};
