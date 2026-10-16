import express from 'express';

export function createApi(providers) {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/providers', (_req, res) => {
    const list = providers.list().map((p) => ({
      name: p.name,
      models: p.getModels(),
      status: p.getStatus()
    }));
    res.json({ providers: list });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const body = req.body || {};
      const { provider, model, message } = body;

      if (typeof provider !== 'string' || provider.length === 0) {
        return res.status(400).json({ error: 'provider is required and must be a string' });
      }
      if (typeof model !== 'string' || model.length === 0) {
        return res.status(400).json({ error: 'model is required and must be a string' });
      }
      if (typeof message !== 'string' || message.length === 0) {
        return res.status(400).json({ error: 'message is required and must be a string' });
      }

      const reply = await providers.chat(provider, model, message);
      res.json({ reply, provider, model });
    } catch (err) {
      const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
      res.status(status).json({ error: err.message });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}