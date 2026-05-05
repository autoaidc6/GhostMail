import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Guerrilla Mail
  app.get('/api/mail', async (req, res) => {
    const { action, sid, id } = req.query;
    
    // Map internal actions to Guerrilla Mail actions
    let guerrillaFunc = '';
    const params: any = {};

    if (action === 'genEmail') {
      guerrillaFunc = 'get_email_address';
    } else if (action === 'getMessages') {
      guerrillaFunc = 'check_email';
      params.seq = '0';
      if (sid) params.sid_token = sid;
    } else if (action === 'readMessage') {
      guerrillaFunc = 'fetch_email';
      params.email_id = id;
      if (sid) params.sid_token = sid;
    }

    const queryParams = new URLSearchParams({
      f: guerrillaFunc,
      ...params
    }).toString();

    const url = `https://api.guerrillamail.com/ajax.php?${queryParams}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Guerrilla Mail API error (${response.status}):`, text.substring(0, 500));
        return res.status(response.status).json({ error: `Mail service responded with status ${response.status}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching from Guerrilla Mail:', error);
      res.status(500).json({ error: 'Failed to connect to mail service' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GhostMail Server running on http://localhost:${PORT}`);
  });
}

startServer();
