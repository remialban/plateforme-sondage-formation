import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );

    // Supprimer les cookies d'authentification
    response.cookies.set('auth_role', '', {
        maxAge: 0,
        path: '/',
    });

    response.cookies.set('auth_token', '', {
        maxAge: 0,
        path: '/',
    });

    return response;
}


