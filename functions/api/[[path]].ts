import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';

type Env = {
  Bindings: {
    DB: D1Database;
    R2: R2Bucket;
    ADMIN_PASSWORD: string;
    JWT_SECRET: string;
    R2_PUBLIC_URL?: string;
  };
};

type JwtPayload = { sub: string; email: string; iat?: number; exp?: number };

type PagesFunction<T = any> = (context: {
  request: Request;
  env: T;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;

const ADMIN_EMAIL = 'admin@photography.com';
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB cap to stay Worker-friendly

const app = new Hono<Env>();

app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ---------- Helpers ----------
const jsonError = (c: any, status: number, message: string) => c.json({ success: false, message }, status);

const requireAuth = async (c: any, next: () => Promise<void>) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return jsonError(c, 401, 'Unauthorized');
  const token = auth.slice('Bearer '.length);
  try {
    const payload = (await verify(token, c.env.JWT_SECRET)) as JwtPayload;
    c.set('user', payload);
    await next();
  } catch (err) {
    console.error('JWT verify error', err);
    return jsonError(c, 401, 'Invalid token');
  }
};

const toUrl = (env: Env['Bindings'], key: string) => {
  if (env.R2_PUBLIC_URL) return `${env.R2_PUBLIC_URL}/${key}`;
  // Fallback to R2 public bucket URL pattern: requires a public domain to be configured.
  return `/${key}`;
};

const mimeFromFilename = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.mp4')) return 'video/mp4';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  return 'application/octet-stream';
};

const nowIso = () => new Date().toISOString();

// ---------- Auth ----------
app.post('/api/auth/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) return jsonError(c, 400, 'Email and password are required');
  if (email !== ADMIN_EMAIL || password !== c.env.ADMIN_PASSWORD) return jsonError(c, 401, 'Invalid credentials');

  const token = await sign({ sub: '1', email }, c.env.JWT_SECRET, 'HS256');
  return c.json({
    success: true,
    token,
    user: { id: '1', email },
    message: 'Login successful',
  });
});

app.post('/api/auth/logout', (c) => c.json({ success: true, message: 'Logged out successfully' }));

app.get('/api/auth/verify', requireAuth, (c) =>
  c.json({ success: true, message: 'Token is valid', user: c.get('user') })
);

// ---------- Health ----------
app.get('/api/health', (c) =>
  c.json({
    success: true,
    message: 'Server is running',
    timestamp: nowIso(),
    environment: 'production',
  })
);

// ---------- Media ----------
app.get('/api/media', async (c) => {
  const rows = (await c.env.DB.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all()).results;
  return c.json({ success: true, data: rows, message: 'Media fetched' });
});

app.get('/api/media/category/:category', async (c) => {
  const category = c.req.param('category');
  const rows = (await c.env.DB.prepare('SELECT * FROM media WHERE category = ? ORDER BY uploaded_at DESC').bind(category).all()).results;
  return c.json({ success: true, data: rows, message: 'Media fetched' });
});

app.get('/api/media/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
  if (!row) return jsonError(c, 404, 'Media not found');
  return c.json({ success: true, data: row, message: 'Media fetched' });
});

app.post('/api/media/upload', requireAuth, async (c) => {
  const form = await c.req.parseBody();
  const file = form['file'] as File | undefined;
  const title = (form['title'] as string) || (file ? file.name : '');
  const caption = (form['caption'] as string) || '';
  const category = (form['category'] as string) || 'Uncategorized';

  if (!file) return jsonError(c, 400, 'File is required');
  if (file.size > MAX_UPLOAD_BYTES) return jsonError(c, 400, 'File too large (max 50MB)');

  const fileExtMime = file.type || mimeFromFilename(file.name);
  const key = `media/${crypto.randomUUID()}`;
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: fileExtMime },
  });

  const fileUrl = toUrl(c.env, key);
  const now = nowIso();

  await c.env.DB.prepare(
    `INSERT INTO media (id, file_name, file_url, title, caption, category, media_type, uploaded_at, file_size, mime_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      key,
      file.name,
      fileUrl,
      title,
      caption,
      category,
      fileExtMime.startsWith('video/') ? 'video' : 'photo',
      now,
      file.size,
      fileExtMime,
      now,
      now
    )
    .run();

  const saved = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(key).first();
  return c.json({ success: true, data: saved, message: 'Media uploaded' });
});

app.put('/api/media/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const fields = ['title', 'caption', 'category'];
  const updates = fields.filter((f) => body[f] !== undefined);
  if (!updates.length) return jsonError(c, 400, 'No fields to update');
  const setClause = updates.map((f) => `${f} = ?`).join(', ');
  const values = updates.map((f) => body[f]);
  values.push(id);
  await c.env.DB.prepare(`UPDATE media SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(...values).run();
  const saved = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: saved, message: 'Media updated' });
});

app.delete('/api/media/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  // best-effort delete from R2
  await c.env.R2.delete(id).catch(() => null);
  await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
  return c.json({ success: true, message: 'Media deleted' });
});

// ---------- Text Content ----------
app.get('/api/text-content', async (c) => {
  const rows = (await c.env.DB.prepare('SELECT * FROM text_content ORDER BY key').all()).results;
  return c.json({ success: true, data: rows, message: 'Text content fetched' });
});

app.get('/api/text-content/:key', async (c) => {
  const key = c.req.param('key');
  const row = await c.env.DB.prepare('SELECT * FROM text_content WHERE key = ?').bind(key).first();
  if (!row) return jsonError(c, 404, 'Not found');
  return c.json({ success: true, data: row, message: 'Text content fetched' });
});

app.put('/api/text-content', requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { key, value } = body as { key?: string; value?: string };
  if (!key || value === undefined) return jsonError(c, 400, 'key and value required');
  await c.env.DB.prepare(
    `INSERT INTO text_content (key, value, created_at, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
  )
    .bind(key, value)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM text_content WHERE key = ?').bind(key).first();
  return c.json({ success: true, data: row, message: 'Text content updated' });
});

app.put('/api/text-content/multiple', requireAuth, async (c) => {
  const updates = (await c.req.json().catch(() => [])) as { key: string; value: string }[];
  const stmt = c.env.DB.prepare(
    `INSERT INTO text_content (key, value, created_at, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
  );
  for (const item of updates) {
    if (!item.key || item.value === undefined) continue;
    await stmt.bind(item.key, item.value).run();
  }
  const rows = (await c.env.DB.prepare('SELECT * FROM text_content ORDER BY key').all()).results;
  return c.json({ success: true, data: rows, message: 'Text content updated' });
});

// ---------- Backgrounds ----------
app.get('/api/backgrounds', async (c) => {
  const rows = (await c.env.DB.prepare('SELECT * FROM background_images ORDER BY section_type, section_name').all()).results;
  return c.json({ success: true, data: rows, message: 'Backgrounds fetched' });
});

app.get('/api/backgrounds/:sectionType', async (c) => {
  const sectionType = c.req.param('sectionType');
  const rows = (
    await c.env.DB.prepare('SELECT * FROM background_images WHERE section_type = ? ORDER BY section_name').bind(sectionType).all()
  ).results;
  return c.json({ success: true, data: rows, message: 'Backgrounds fetched' });
});

app.post('/api/admin/backgrounds', requireAuth, async (c) => {
  const form = await c.req.parseBody();
  const file = form['backgroundImage'] as File | undefined;
  const sectionType = form['sectionType'] as string | undefined;
  const sectionName = form['sectionName'] as string | undefined;

  if (!sectionType || !sectionName) return jsonError(c, 400, 'sectionType and sectionName are required');
  if (!file) return jsonError(c, 400, 'backgroundImage is required');
  if (file.size > MAX_UPLOAD_BYTES) return jsonError(c, 400, 'File too large (max 50MB)');

  const mime = file.type || mimeFromFilename(file.name);
  const key = `backgrounds/${crypto.randomUUID()}`;
  await c.env.R2.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: mime } });
  const url = toUrl(c.env, key);

  // Upsert
  await c.env.DB.prepare(
    `INSERT INTO background_images (section_type, section_name, background_image_url, file_name, file_size, mime_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(section_type, section_name)
     DO UPDATE SET background_image_url=excluded.background_image_url,
                   file_name=excluded.file_name,
                   file_size=excluded.file_size,
                   mime_type=excluded.mime_type,
                   updated_at=CURRENT_TIMESTAMP`
  )
    .bind(sectionType, sectionName, url, file.name, file.size, mime)
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM background_images WHERE section_type = ? AND section_name = ?')
    .bind(sectionType, sectionName)
    .first();
  return c.json({ success: true, data: row, message: 'Background image saved' });
});

app.delete('/api/admin/backgrounds/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM background_images WHERE id = ?').bind(id).first();
  if (existing) {
    const key = (existing.background_image_url as string) || '';
    // Try to delete object if the key matches our pattern
    const maybeKey = key.startsWith('http') ? key.split('/').slice(-2).join('/') : key.replace(/^\//, '');
    await c.env.R2.delete(maybeKey).catch(() => null);
  }
  await c.env.DB.prepare('DELETE FROM background_images WHERE id = ?').bind(id).run();
  return c.json({ success: true, message: 'Background image deleted' });
});

// ---------- Quotations ----------
app.post('/api/quotations', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { name, email, phone, eventDate, location, message, service } = body as any;
  if (!name || !email || !phone || !eventDate || !location || !message || !service) {
    return jsonError(c, 400, 'All fields are required');
  }
  await c.env.DB.prepare(
    `INSERT INTO quotations (name, email, phone, event_date, location, message, service, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  )
    .bind(name, email, phone, eventDate, location, message, service)
    .run();
  return c.json({ success: true, message: 'Quotation submitted' });
});

app.get('/api/admin/quotations', requireAuth, async (c) => {
  const rows = (await c.env.DB.prepare('SELECT * FROM quotations ORDER BY created_at DESC').all()).results;
  return c.json({ success: true, data: rows, message: 'Quotations fetched' });
});

app.get('/api/admin/quotations/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM quotations WHERE id = ?').bind(id).first();
  if (!row) return jsonError(c, 404, 'Not found');
  return c.json({ success: true, data: row, message: 'Quotation fetched' });
});

app.put('/api/admin/quotations/:id/status', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const status = body.status as string;
  if (!['pending', 'contacted', 'completed'].includes(status)) return jsonError(c, 400, 'Invalid status');
  await c.env.DB.prepare('UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(status, id)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM quotations WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: row, message: 'Quotation updated' });
});

app.delete('/api/admin/quotations/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM quotations WHERE id = ?').bind(id).run();
  return c.json({ success: true, message: 'Quotation deleted' });
});

// ---------- Export for Pages Functions ----------
// This file is in functions/api/[[path]].ts, so it only handles /api/* routes
export const onRequest: PagesFunction<Env['Bindings']> = async (context) => {
  return app.fetch(context.request, context.env, context);
};

