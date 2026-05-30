import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { initFirebase } from './config/firebase.js';
import { initGemini } from './config/gemini.js';
import { initTwilio } from './config/twilio.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { setupSocket } from './socket/index.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5174';

async function main() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  OmniFlow AI — Server Starting');
  console.log('═══════════════════════════════════════════\n');

  // Firebase (optional)
  try {
    initFirebase();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[WARN] Firebase not configured: ' + message);
  }

  // Gemini AI (optional)
  try {
    initGemini();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[WARN] Gemini AI not configured: ' + message);
  }

  // Twilio (optional)
  try {
    initTwilio();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[WARN] Twilio not configured: ' + message);
  }

  const app = express();
  const httpServer = createServer(app);

  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, _res, next) => {
    console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + req.path);
    next();
  });

  app.use('/api', apiRoutes);

  // Setup Socket.IO
  setupSocket(httpServer);
  console.log('[Socket] IO namespace /chat ready');

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found. See /api/health for available endpoints.',
    });
  });

  app.use(errorHandler);

  httpServer.listen(PORT, () => {
    console.log('\n─────────────────────────────────────────────');
    console.log('  Server:    http://localhost:' + PORT);
    console.log('  Health:    http://localhost:' + PORT + '/api/health');
    console.log('  Socket:    ws://localhost:' + PORT + '/chat');
    console.log('  CORS:      ' + CORS_ORIGIN);
    console.log('─────────────────────────────────────────────\n');
  });
}

main().catch((error) => {
  console.error('[FATAL] Server failed to start:', error);
  process.exit(1);
});
