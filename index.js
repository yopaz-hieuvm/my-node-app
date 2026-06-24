const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const APP_NAME = process.env.APP_NAME || 'my-node-app';
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

app.disable('x-powered-by');
app.use(express.json());

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
  });

  next();
});

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${APP_NAME}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0b1020;
        --panel: rgba(16, 24, 47, 0.82);
        --panel-border: rgba(255, 255, 255, 0.12);
        --text: #e7ecff;
        --muted: #9aa7d1;
        --accent: #5eead4;
        --accent-2: #60a5fa;
        --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top, rgba(96, 165, 250, 0.24), transparent 30%),
          radial-gradient(circle at right, rgba(94, 234, 212, 0.16), transparent 28%),
          linear-gradient(160deg, #060816 0%, #0b1020 45%, #111936 100%);
        display: grid;
        place-items: center;
        padding: 24px;
      }

      .card {
        width: min(920px, 100%);
        padding: 40px;
        border: 1px solid var(--panel-border);
        border-radius: 28px;
        background: var(--panel);
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 14px;
        color: var(--accent);
        background: rgba(94, 234, 212, 0.1);
        border: 1px solid rgba(94, 234, 212, 0.18);
      }

      h1 {
        margin: 18px 0 12px;
        font-size: clamp(2.4rem, 6vw, 4.8rem);
        line-height: 0.95;
        letter-spacing: -0.04em;
      }

      p {
        margin: 0;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.7;
        max-width: 62ch;
      }

      .grid {
        margin-top: 30px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .item {
        padding: 18px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--muted);
        margin-bottom: 10px;
      }

      .value {
        font-size: 1.1rem;
        font-weight: 600;
      }

      .actions {
        margin-top: 28px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      a.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 14px;
        text-decoration: none;
        font-weight: 600;
        color: #07111f;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
      }

      .ghost {
        color: var(--text);
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.14);
      }

      @media (max-width: 640px) {
        .card {
          padding: 24px;
          border-radius: 22px;
        }

        .grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="badge">● Server is running</div>
      <h1>${APP_NAME}</h1>
      <p>
        Một landing page HTML gọn, đẹp và hiện đại để thay cho JSON thuần.
        Đây là nơi hợp để giới thiệu ứng dụng, hiển thị trạng thái, và dẫn người dùng vào các API khác.
      </p>

      <section class="grid" aria-label="Application details">
        <div class="item">
          <div class="label">Version</div>
          <div class="value">${APP_VERSION}</div>
        </div>
        <div class="item">
          <div class="label">Environment</div>
          <div class="value">${process.env.NODE_ENV || 'development'}</div>
        </div>
      </section>

      <div class="actions">
        <a class="button" href="/health">Check Health</a>
        <a class="button ghost" href="/api/info">View API Info</a>
      </div>
    </main>
  </body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: APP_NAME,
    version: APP_VERSION,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
