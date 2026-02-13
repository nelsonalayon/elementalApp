import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/',           // Página principal (dashboard)
  '/apartment',  // Todas las rutas de apartamentos
  '/dashboard',
  '/profile',
  '/settings'
];

// Rutas que NO deben ser accesibles si ya estás logueado
const authRoutes = [
  '/login',
  '/register'
];

// Función para validar si un token JWT es válido
function isTokenValid(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener token de las cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = token && isTokenValid(token);

  console.log('Middleware:', { pathname, hasToken: !!token, isAuthenticated });

  // Si intenta acceder a una ruta protegida sin estar autenticado
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
  
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Redirecting to login, protected route without auth');
    const loginUrl = new URL('/login', request.url);
    
    // Solo agregar redirect si no es la página principal
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado e intenta acceder a login/register, redirigir al dashboard
  const isAuthRoute = authRoutes.includes(pathname);
  
  if (isAuthRoute && isAuthenticated) {
    console.log('Redirecting to dashboard, already authenticated');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configurar qué rutas debe interceptar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};