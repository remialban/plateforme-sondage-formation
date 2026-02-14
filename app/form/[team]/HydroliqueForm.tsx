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
    niveauSouhaite: string;
    priorite: string;
};

type Props = {
    techniciens: Technicien[];
    onSelectionsChange: (selections: TechnicienSelection[]) => void;
    initialSelections?: TechnicienSelection[];
    isReadOnly?: boolean;
};

export default function HydroliqueForm({ techniciens, onSelectionsChange, initialSelections = [], isReadOnly = false }: Props) {
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
            technicienId: techId,
            niveauSouhaite: '1',
            priorite: '1'
        }]);
        setSelectedTechnicienId('');
    };

    const supprimerTechnicien = (technicienId: number) => {
        setSelections(selections.filter(s => s.technicienId !== technicienId));
    };

    const modifierNiveau = (technicienId: number, niveau: string) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, niveauSouhaite: niveau } : s
        ));
    };

    const modifierPriorite = (technicienId: number, priorite: string) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, priorite } : s
        ));
    };

    const getTechnicienById = (id: number) => {
        return techniciens.find(t => t.id === id);
    };

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">
                <h2 className="h5 mb-0">Hydrolique</h2>
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

                {/* Tableau des techniciens sélectionnés */}
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
                                        <th style={{ width: '250px' }}>Niveau souhaité {!isReadOnly && <span className="text-danger">*</span>}</th>
                                        <th style={{ width: '150px' }}>Priorité {!isReadOnly && <span className="text-danger">*</span>}</th>
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
                                                <td>
                                                    <div className="d-flex flex-column gap-2">
                                                        {['1', '2', '3'].map((niveau) => (
                                                            <div key={niveau} className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name={`niveau-${selection.technicienId}`}
                                                                    id={`niveau-${selection.technicienId}-${niveau}`}
                                                                    value={niveau}
                                                                    checked={selection.niveauSouhaite === niveau}
                                                                    onChange={(e) => modifierNiveau(selection.technicienId, e.target.value)}
                                                                    required
                                                                    disabled={isReadOnly}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={`niveau-${selection.technicienId}-${niveau}`}
                                                                >
                                                                    Niveau {niveau}{' '}
                                                                    <a
                                                                        href="https://google.com"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="badge bg-info text-decoration-none ms-1"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        🔗 Lien
                                                                    </a>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={selection.priorite}
                                                        onChange={(e) => modifierPriorite(selection.technicienId, e.target.value)}
                                                        required
                                                        disabled={isReadOnly}
                                                    >
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </td>
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

