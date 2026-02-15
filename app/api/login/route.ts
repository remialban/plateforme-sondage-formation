import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Mot de passe requis' },
                { status: 400 }
            );
        }

        const adminPassword = process.env.PASSWORD_ADMIN;

        if (password !== adminPassword) {
            return NextResponse.json(
                { error: 'Mot de passe administrateur incorrect' },
                { status: 401 }
            );
        }

        // Créer une réponse avec un cookie de session pour admin
        const response = NextResponse.json(
            { role: 'admin', success: true },
            { status: 200 }
        );

        // Définir un cookie sécurisé avec le rôle admin
        response.cookies.set('auth_role', 'admin', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 heures
            path: '/',
        });

        response.cookies.set('auth_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 heures
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}

