import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { password } = req.body as { password?: string };
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    // No password configured — allow access (dev / misconfigured deploy)
    return res.status(200).json({ ok: true });
  }

  if (!password || password !== sitePassword) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const isProduction = process.env.VERCEL_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `proto-auth=${encodeURIComponent(sitePassword)}; Path=/; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}; Max-Age=86400`,
  );

  return res.status(200).json({ ok: true });
}
