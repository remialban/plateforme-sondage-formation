'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function AuthNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Vérifier si l'utilisateur est admin
        fetch('/api/check-auth')
            .then(res => res.json())
            .then(data => {
                if (data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            })
            .catch(() => {
                setIsAdmin(false);
            });
    }, [pathname]);

    const handleLogout = async () => {
        if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            return;
        }

        setIsLoading(true);

        try {
            await fetch('/api/logout', {
                method: 'POST',
            });

            setIsAdmin(false);
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
            alert('Erreur lors de la déconnexion');
            setIsLoading(false);
        }
    };

    // Ne pas afficher la navbar sur la page de login
    if (pathname === '/login') {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div style={{ flex: '1' }}>
                    <Link className="navbar-brand" href="/">
                        📋 Développons nos compétences
                    </Link>
                </div>

                <div style={{ flex: '1' }} className="d-flex justify-content-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        height={36}
                    />
                </div>

                <div style={{ flex: '1' }} className="d-flex justify-content-end">
                    {isAdmin && (
                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            {isLoading ? '⏳ Déconnexion...' : '🚪 Se déconnecter (Admin)'}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
