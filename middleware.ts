import { next, redirect } from '@vercel/edge';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Always allow: login page, auth API, and all static assets
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/assets/') ||
    /\.(js|css|ico|png|svg|woff2?|ttf|eot|map)$/.test(pathname)
  ) {
    return next();
  }

  const password = process.env.SITE_PASSWORD;

  // If no password is configured, allow everything through (dev / unconfigured)
  if (!password) {
    return next();
  }

  // Parse the proto-auth cookie
  const cookieHeader = request.headers.get('cookie') ?? '';
  const authValue = cookieHeader
    .split(';')
    .map(c => c.trim().split('='))
    .find(([name]) => name === 'proto-auth')?.[1];

  if (authValue === encodeURIComponent(password)) {
    return next();
  }

  return redirect(new URL('/login', request.url));
}
