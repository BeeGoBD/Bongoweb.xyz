import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Safe WebSocket close helper to prevent unhandled TypeError exceptions
function safeWsClose(targetWs: any, code?: number, reason?: string | Buffer) {
  try {
    if (!targetWs || targetWs.readyState === 2 || targetWs.readyState === 3) {
      return;
    }

    const isValidCode =
      typeof code === 'number' &&
      ((code >= 1000 &&
        code <= 1014 &&
        code !== 1004 &&
        code !== 1005 &&
        code !== 1006) ||
        (code >= 3000 && code <= 4999));

    if (isValidCode) {
      const safeReason =
        typeof reason === 'string'
          ? reason.slice(0, 100)
          : Buffer.isBuffer(reason)
          ? reason.subarray(0, 100).toString('utf-8')
          : undefined;
      targetWs.close(code, safeReason);
    } else {
      targetWs.close();
    }
  } catch (_) {
    try {
      targetWs.terminate();
    } catch (__) {
      // no-op
    }
  }
}

// HTTP Server for Vercel Serverless Function & WebSocket Upgrade
const server = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  });
  res.end(JSON.stringify({ status: 'ok', service: 'BongoWeb Alap AI Live Chat Bridge' }));
});

const alapaiProxyWss = new WebSocketServer({ server });

alapaiProxyWss.on('connection', (clientWs: WebSocket, request: any) => {
  try {
    const parsedUrl = new URL(request.url || '', `http://${request.headers?.host || 'localhost'}`);
    const key = parsedUrl.searchParams.get('key') || '2c8b94ad-421a-4a4e-a029-f86d59d21330';
    const upstreamUrl = `wss://api.alapai.app/ws/widget/?key=${encodeURIComponent(key)}`;

    const upstreamWs = new WebSocket(upstreamUrl, {
      headers: {
        Origin: 'https://bongoweb.xyz',
        'User-Agent': (request.headers?.['user-agent'] as string) || 'BongoWeb/1.0'
      }
    });

    const queue: Array<{ data: any; isBinary: boolean }> = [];

    clientWs.on('message', (data, isBinary) => {
      try {
        if (upstreamWs.readyState === WebSocket.OPEN) {
          upstreamWs.send(data, { binary: isBinary });
        } else if (upstreamWs.readyState === WebSocket.CONNECTING) {
          queue.push({ data, isBinary });
        }
      } catch (err) {
        console.error('[Vercel Alapai Proxy Client Msg Error]:', err);
      }
    });

    upstreamWs.on('open', () => {
      try {
        while (queue.length > 0) {
          const item = queue.shift();
          if (item && upstreamWs.readyState === WebSocket.OPEN) {
            upstreamWs.send(item.data, { binary: item.isBinary });
          }
        }
      } catch (err) {
        console.error('[Vercel Alapai Proxy Queue Flush Error]:', err);
      }
    });

    upstreamWs.on('message', (data, isBinary) => {
      try {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(data, { binary: isBinary });
        }
      } catch (err) {
        console.error('[Vercel Alapai Proxy Upstream Msg Error]:', err);
      }
    });

    upstreamWs.on('close', (code, reason) => {
      safeWsClose(clientWs, code, reason);
    });

    upstreamWs.on('error', (err: any) => {
      console.error('[Vercel Alapai Proxy Upstream Error]:', err?.message);
      safeWsClose(clientWs, 1011, 'Alap AI upstream error');
    });

    clientWs.on('close', (code, reason) => {
      safeWsClose(upstreamWs, code, reason);
    });

    clientWs.on('error', (err: any) => {
      console.error('[Vercel Alapai Proxy Client Error]:', err?.message);
      safeWsClose(upstreamWs);
    });
  } catch (err) {
    console.error('[Vercel Alapai Proxy Setup Error]:', err);
  }
});

export default server;
