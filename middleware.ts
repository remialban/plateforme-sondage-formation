import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token');
    const authRole = request.cookies.get('auth_role');
    const pathname = request.nextUrl.pathname;

    // Routes publiques (accessibles sans authentification)
    const publicRoutes = ['/login', '/api/login', '/api/logout', '/form', '/', '/api/check-auth'];

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    if (isPublicRoute) {
        // Si déjà connecté en tant qu'admin sur /login, rediriger vers dashboard
        if (pathname === '/login' && authToken && authRole?.value === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Vérifier les permissions pour /dashboard - ADMIN uniquement
    if (pathname.startsWith('/dashboard')) {
        if (!authToken || authRole?.value !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    // Vérifier les permissions pour les routes API
    if (pathname.startsWith('/api')) {
        // Routes API publiques (accessibles sans authentification)
        if (pathname === '/api/login' || pathname === '/api/logout' || pathname === '/api/check-auth') {
            return NextResponse.next();
        }

        // Routes API réservées aux admins uniquement
        const adminOnlyRoutes = ['/api/export-csv', '/api/unvalidate-equipe'];
        if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
            if (!authToken || authRole?.value !== 'admin') {
                return NextResponse.json(
                    { error: 'Accès refusé - Droits administrateur requis' },
                    { status: 403 }
                );
            }
        }

        // Autres routes API accessibles sans authentification (pour les formulaires)
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};


