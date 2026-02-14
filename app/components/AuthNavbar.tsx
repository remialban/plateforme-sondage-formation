'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function AuthNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    // Déterminer si on est authentifié en fonction de la page
    const isAuthenticated = pathname !== '/login';

    const handleLogout = async () => {
        if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            return;
        }

        setIsLoading(true);

        try {
            await fetch('/api/logout', {
                method: 'POST',
            });

            router.push('/login');
            router.refresh();
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
            alert('Erreur lors de la déconnexion');
            setIsLoading(false);
        }
    };

    // Ne pas afficher la navbar sur la page de login
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    📋 Sondage Formation
                </Link>
                <div className="ms-auto">
                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                        disabled={false}
                    >
                        {isLoading ? '⏳ Déconnexion...' : '🚪 Se déconnecter'}
                    </button>
                </div>
            </div>
        </nav>
    );
}


