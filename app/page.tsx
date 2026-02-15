'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier le rôle de l'utilisateur
        fetch('/api/check-auth')
            .then(res => res.json())
            .then(data => {
                if (data.role) {
                    setRole(data.role);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white text-center">
                            <h1 className="h3 mb-0">📋 Bienvenue sur Sondage Formation</h1>
                        </div>
                        <div className="card-body p-5 text-center">
                            <p className="lead mb-4">
                                Bienvenue ! Veuillez choisir une action ci-dessous.
                            </p>

                            <div className="d-grid gap-3">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => router.push('/form')}
                                >
                                    📝 Remplir un formulaire
                                </button>

                                {role === 'admin' && (
                                    <button
                                        className="btn btn-success btn-lg"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        📊 Accéder au Dashboard (Admin)
                                    </button>
                                )}

                                {!role && (
                                    <button
                                        className="btn btn-outline-secondary btn-lg"
                                        onClick={() => router.push('/login')}
                                    >
                                        🔐 Connexion Administrateur
                                    </button>
                                )}
                            </div>

                            {role === 'admin' && (
                                <div className="alert alert-info mt-4" role="alert">
                                    <strong>👤 Connecté en tant qu&apos;administrateur</strong>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
