import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verify } from './lib/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware path:', request.nextUrl.pathname);
  
  // Pozwól na dostęp do endpointów autoryzacji i strony logowania
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register') {
    return NextResponse.next();
  }

  // Sprawdź token
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1];

  console.log('Token present:', !!token);

  if (!token) {
    // Dla żądań API
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Missing authentication token' },
        { status: 401 }
      );
    }
    
    // Dla stron
    const loginUrl = new URL('/login', request.url);
    console.log('Redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verify(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('userId', String(payload.userId));

  return NextResponse.next({
    headers: requestHeaders,
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico).*)',
  ],
}; 