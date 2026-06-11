const http = require('http');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { createApp } = require('./src/app');
const { connectDatabase } = require('./src/config/db');
const { initializeSocket } = require('./src/sockets');

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);
  initializeSocket(server, app);

  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    // Log the listening port after all infrastructure is ready.
    console.log(`Backend server listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
