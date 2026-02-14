'use client';

export function UnvalidateButton({ equipeReference }: { equipeReference: string }) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!confirm('Êtes-vous sûr de vouloir dé-valider cette équipe ?')) {
            return;
        }

        const formData = new FormData();
        formData.append('equipeReference', equipeReference);

        try {
            const response = await fetch('/api/unvalidate-equipe', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Redirection vers le dashboard
                window.location.href = '/dashboard';
            } else {
                alert('Erreur lors de la dé-validation');
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert('Une erreur inattendue est survenue');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-inline">
            <button
                type="submit"
                className="btn btn-sm btn-outline-danger ms-2"
            >
                Dé-valider
            </button>
        </form>
    );
}

