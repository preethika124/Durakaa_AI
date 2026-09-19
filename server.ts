import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const requestedPort = Number(process.env.PORT || 3000);
let port = requestedPort;
const BACKEND_PORT = 8000;
const pythonExecutable = process.env.PYTHON_EXECUTABLE ||
  (process.platform === 'win32' ? 'python' : 'python3');

let pythonProcess: ChildProcess | null = null;

async function backendIsHealthy() {
  try {
    const response = await fetch(`http://127.0.0.1:${BACKEND_PORT}/api/health`, {
      signal: AbortSignal.timeout(1_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function startBackend() {
  console.log(`[DARUKAA.EARTH] Spawning Python FastAPI backend on port ${BACKEND_PORT}...`);
  pythonProcess = spawn(pythonExecutable, [
    '-m', 'uvicorn',
    'backend.app.main:app',
    '--host', '127.0.0.1',
    '--port', String(BACKEND_PORT)
  ], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  pythonProcess.on('error', (err) => {
    console.error(
      `[DARUKAA.EARTH] Failed to start Python (${pythonExecutable}):`,
      err
    );
    console.error('Set PYTHON_EXECUTABLE in .env if Python is installed under a different command.');
  });
}

function stopBackend() {
  pythonProcess?.kill();
  pythonProcess = null;
}

process.on('exit', () => {
  stopBackend();
});
process.on('SIGINT', () => {
  stopBackend();
  process.exit();
});
process.on('SIGTERM', () => {
  stopBackend();
  process.exit();
});

// Proxy /api requests to FastAPI backend
app.use('/api', createProxyMiddleware({
  target: `http://127.0.0.1:${BACKEND_PORT}`,
  changeOrigin: true,
  ws: true,
  // Express removes the mount path before proxying. FastAPI routes retain
  // the `/api` prefix, so add it back for every forwarded request.
  pathRewrite: (path) => `/api${path}`,
}));

async function startServer() {
  if (await backendIsHealthy()) {
    console.log(`[DARUKAA.EARTH] Reusing healthy FastAPI backend on port ${BACKEND_PORT}.`);
  } else {
    startBackend();
  }

  if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
    // In dev mode, use Vite middleware
    process.env.DISABLE_HMR = 'true';
    const { createServer } = await import('vite');
    const vite = await createServer({
      // Express owns the HTTP server in this mode. Disabling Vite's separate
      // HMR socket prevents a second port from conflicting with another run.
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const listen = (candidatePort: number) => {
    const httpServer = app.listen(candidatePort, '0.0.0.0');

    httpServer.once('listening', () => {
      const address = httpServer.address();
      port = typeof address === 'object' && address ? address.port : candidatePort;
      console.log(`[DARUKAA.EARTH] Open http://localhost:${port} in your browser.`);
    });

    httpServer.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && candidatePort !== 0) {
        console.warn(`[DARUKAA.EARTH] Port ${candidatePort} is busy; selecting a free port automatically.`);
        listen(0);
        return;
      }
      console.error('[DARUKAA.EARTH] Server startup failed:', err);
      stopBackend();
      process.exit(1);
    });
  };

  listen(requestedPort);
}

startServer().catch((err) => {
  console.error('[DARUKAA.EARTH] Server startup failed:', err);
  process.exit(1);
});
