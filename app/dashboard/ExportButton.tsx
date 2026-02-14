'use client';

import { useState } from 'react';

type Equipe = {
    reference: string;
    name: string;
};

export function ExportButton({ equipes }: { equipes: Equipe[] }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const response = await fetch('/api/export-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ equipeReferences: equipes.map(e => e.reference) }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'export');
            }

            // Récupérer le blob ZIP
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export-sondages-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('Export réussi ! Un fichier ZIP contenant les CSV a été téléchargé.');
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur lors de l\'export');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isExporting || equipes.length === 0}
        >
            {isExporting ? '⏳ Export en cours...' : '📥 Exporter en CSV'}
        </button>
    );
}

