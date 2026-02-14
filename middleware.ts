import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token');
    const authRole = request.cookies.get('auth_role');
    const pathname = request.nextUrl.pathname;

    // Routes publiques (accessibles sans authentification)
    const publicRoutes = ['/login', '/api/login'];

    // Vérifier si la route est publique
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    if (isPublicRoute) {
        // Si déjà connecté, rediriger vers la page d'accueil
        if (authToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Vérifier l'authentification
    if (!authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Vérifier les permissions pour /form et /form/[team]
    if (pathname.startsWith('/form')) {
        if (authRole?.value === 'admin' || authRole?.value === 'user') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Vérifier les permissions pour /dashboard
    if (pathname.startsWith('/dashboard')) {
        if (authRole?.value === 'admin') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/form', request.url));
    }

    // Vérifier les permissions pour les routes API
    if (pathname.startsWith('/api')) {
        // Routes API publiques (accessibles sans authentification)
        if (pathname === '/api/login' || pathname === '/api/logout') {
            return NextResponse.next();
        }

        // Vérifier l'authentification
        if (!authToken) {
            return NextResponse.json(
                { error: 'Non autorisé - Authentification requise' },
                { status: 401 }
            );
        }

        // Routes API réservées aux admins uniquement
        const adminOnlyRoutes = ['/api/export-csv', '/api/unvalidate-equipe'];
        if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
            if (authRole?.value !== 'admin') {
                return NextResponse.json(
                    { error: 'Accès refusé - Droits administrateur requis' },
                    { status: 403 }
                );
            }
        }

        // Autres routes API accessibles aux utilisateurs authentifiés
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};


