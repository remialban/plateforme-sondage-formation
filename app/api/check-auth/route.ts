import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authToken = request.cookies.get('auth_token');
    const authRole = request.cookies.get('auth_role');

    if (!authToken) {
        return NextResponse.json(
            { authenticated: false, role: null },
            { status: 401 }
        );
    }

    return NextResponse.json({
        authenticated: true,
        role: authRole?.value || null,
    });
}

