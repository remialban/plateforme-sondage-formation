'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Mot de passe incorrect');
                setIsLoading(false);
                return;
            }

            // Redirection vers la page d'accueil
            router.push('/');

            // Forcer le rafraîchissement pour mettre à jour la navbar
            router.refresh();
        } catch (err) {
            console.error('Erreur:', err);
            setError('Une erreur est survenue');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h1 className="h4 mb-0">🔐 Authentification</h1>
                        </div>
                        <div className="card-body p-5">
                            <p className="text-muted mb-4">Veuillez entrer votre mot de passe pour accéder à l&apos;application.</p>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        placeholder="Entrez votre mot de passe..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={isLoading || !password}
                                >
                                    {isLoading ? '⏳ Vérification...' : '🔓 Se connecter'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

