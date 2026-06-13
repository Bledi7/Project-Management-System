import 'dotenv/config';
import app from './app';
import { env } from './config/env';

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`\n🚀 Server running  → http://localhost:${env.PORT}`);
    console.log(`🏥 Health check    → http://localhost:${env.PORT}/health`);
    console.log(`📦 Environment     → ${env.NODE_ENV}\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
