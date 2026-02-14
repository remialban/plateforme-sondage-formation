'use client';

import { useState, useEffect } from 'react';

type Technicien = {
    id: number;
    nom: string;
    prenom: string;
    equipe: string;
};

type TechnicienSelection = {
    technicienId: number;
};

type Props = {
    techniciens: Technicien[];
    onSelectionsChange: (selections: TechnicienSelection[]) => void;
    initialSelections?: TechnicienSelection[];
    isReadOnly?: boolean;
};

export default function TechnicienForm({ techniciens, onSelectionsChange, initialSelections = [], isReadOnly = false }: Props) {
    const [selections, setSelections] = useState<TechnicienSelection[]>(initialSelections);
    const [selectedTechnicienId, setSelectedTechnicienId] = useState<string>('');

    useEffect(() => {
        onSelectionsChange(selections);
    }, [selections, onSelectionsChange]);

    const techniciensFiltres = techniciens.filter(tech => {
        return !selections.find(s => s.technicienId === tech.id);
    });

    const ajouterTechnicien = () => {
        if (!selectedTechnicienId) return;

        const techId = parseInt(selectedTechnicienId);
        if (selections.find(s => s.technicienId === techId)) {
            return;
        }
        setSelections([...selections, {
            technicienId: techId
        }]);
        setSelectedTechnicienId('');
    };

    const supprimerTechnicien = (technicienId: number) => {
        setSelections(selections.filter(s => s.technicienId !== technicienId));
    };

    const getTechnicienById = (id: number) => {
        return techniciens.find(t => t.id === id);
    };

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">
                <h2 className="h5 mb-0">Automatisme</h2>
            </div>
            <div className="card-body">
                {/* Sélection de techniciens via dropdown simple */}
                {!isReadOnly && (
                    <div className="mb-4">
                        <label className="form-label fw-bold">Ajouter un technicien :</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                value={selectedTechnicienId}
                                onChange={(e) => setSelectedTechnicienId(e.target.value)}
                            >
                                <option value="">-- Sélectionner un technicien --</option>
                                {techniciensFiltres.map(tech => (
                                    <option key={tech.id} value={tech.id}>
                                        {tech.prenom} {tech.nom}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={ajouterTechnicien}
                                disabled={!selectedTechnicienId}
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                )}

                {/* ...existing code... */}
                <div>
                    <label className="form-label fw-bold">Techniciens sélectionnés :</label>
                    {selections.length === 0 ? (
                        <p className="text-muted">Aucun technicien sélectionné</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="table-light">
                                <tr>
                                    <th>Technicien</th>
                                    {!isReadOnly && <th style={{ width: '100px' }}>Actions</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {selections.map(selection => {
                                    const tech = getTechnicienById(selection.technicienId);
                                    if (!tech) return null;
                                    return (
                                        <tr key={selection.technicienId}>
                                            <td>{tech.prenom} {tech.nom}</td>
                                            {!isReadOnly && (
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => supprimerTechnicien(selection.technicienId)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}