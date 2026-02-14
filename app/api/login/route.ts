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
        const userPassword = process.env.PASSWORD_USER;

        let role = '';

        if (password === adminPassword) {
            role = 'admin';
        } else if (password === userPassword) {
            role = 'user';
        } else {
            return NextResponse.json(
                { error: 'Mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Créer une réponse avec un cookie de session
        const response = NextResponse.json(
            { role, success: true },
            { status: 200 }
        );

        // Définir un cookie sécurisé avec le rôle
        response.cookies.set('auth_role', role, {
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

