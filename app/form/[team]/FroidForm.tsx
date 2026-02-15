'use client';

import { useState, useEffect, Fragment } from 'react';

type Technicien = {
    id: number;
    nom: string;
    prenom: string;
    equipe: string;
};

type Formation = {
    id: number;
    name: string;
    link: string;
};

type TechnicienSelection = {
    technicienId: number;
    typeFormation: string;
    marque?: string;
    modele?: string;
    formationId?: number;
};

type Props = {
    techniciens: Technicien[];
    formations: Formation[];
    onSelectionsChange: (selections: TechnicienSelection[]) => void;
    initialSelections?: TechnicienSelection[];
    isReadOnly?: boolean;
};

export default function FroidForm({ techniciens, formations, onSelectionsChange, initialSelections = [], isReadOnly = false }: Props) {
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
            typeFormation: 'compagnonnage'
        }]);
        setSelectedTechnicienId('');
    };

    const supprimerTechnicien = (technicienId: number) => {
        setSelections(selections.filter(s => s.technicienId !== technicienId));
    };


    const modifierTypeFormation = (technicienId: number, typeFormation: string) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, typeFormation, marque: '', modele: '' } : s
        ));
    };

    const modifierMarque = (technicienId: number, marque: string) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, marque } : s
        ));
    };

    const modifierModele = (technicienId: number, modele: string) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, modele } : s
        ));
    };

    const modifierFormation = (technicienId: number, formationId: number) => {
        setSelections(selections.map(s =>
            s.technicienId === technicienId ? { ...s, formationId } : s
        ));
    };

    const getTechnicienById = (id: number) => {
        return techniciens.find(t => t.id === id);
    };


    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">
                <h2 className="h5 mb-0">Froid</h2>
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
                                        <th style={{ width: '250px' }}>Type de formation {!isReadOnly && <span className="text-danger">*</span>}</th>
                                        {!isReadOnly && <th style={{ width: '100px' }}>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selections.map(selection => {
                                        const tech = getTechnicienById(selection.technicienId);
                                        if (!tech) return null;
                                        return (
                                            <Fragment key={selection.technicienId}>
                                                <tr className="border-top border-3">
                                                    <td className="pt-3">
                                                        <span>{tech.prenom} {tech.nom}</span>
                                                    </td>
                                                    <td className="pt-3">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={selection.typeFormation}
                                                            onChange={(e) => modifierTypeFormation(selection.technicienId, e.target.value)}
                                                            required
                                                            disabled={isReadOnly}
                                                        >
                                                            <option value="compagnonnage">Compagnonnage</option>
                                                            <option value="formation_generalisee">Formation généralisée</option>
                                                            <option value="formation_constructeur">Formation constructeur</option>
                                                        </select>
                                                    </td>
                                                    {!isReadOnly && (
                                                        <td className="pt-3">
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
                                                {selection.typeFormation === 'formation_constructeur' && (
                                                    <tr>
                                                        <td colSpan={isReadOnly ? 2 : 3} className="bg-light pb-3">
                                                            <div className="row g-3 px-3">
                                                                <div className="col-md-6">
                                                                    <label className="form-label fw-bold small">
                                                                        Marque {!isReadOnly && <span className="text-danger">*</span>}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Entrez la marque..."
                                                                        value={selection.marque || ''}
                                                                        onChange={(e) => modifierMarque(selection.technicienId, e.target.value)}
                                                                        required={!isReadOnly}
                                                                        disabled={isReadOnly}
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="form-label fw-bold small">
                                                                        Modèle {!isReadOnly && <span className="text-danger">*</span>}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Entrez le modèle..."
                                                                        value={selection.modele || ''}
                                                                        onChange={(e) => modifierModele(selection.technicienId, e.target.value)}
                                                                        required={!isReadOnly}
                                                                        disabled={isReadOnly}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {selection.typeFormation === 'formation_generalisee' && (
                                                    <tr>
                                                        <td colSpan={isReadOnly ? 2 : 3} className="bg-light pb-3">
                                                            <div className="px-3">
                                                                <label className="form-label fw-bold small mb-3">
                                                                    Sélectionnez une formation : {!isReadOnly && <span className="text-danger">*</span>}
                                                                </label>
                                                                <div className="d-flex flex-column gap-2">
                                                                    {formations.map(formation => (
                                                                        <div key={formation.id} className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name={`formation-${selection.technicienId}`}
                                                                                id={`formation-${selection.technicienId}-${formation.id}`}
                                                                                checked={selection.formationId === formation.id}
                                                                                onChange={() => modifierFormation(selection.technicienId, formation.id)}
                                                                                required={!isReadOnly}
                                                                                disabled={isReadOnly}
                                                                            />
                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor={`formation-${selection.technicienId}-${formation.id}`}
                                                                            >
                                                                                <span className="me-2">{formation.name}</span>
                                                                                {formation.link && (
                                                                                    <a
                                                                                        href={formation.link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="badge bg-primary text-white text-decoration-none"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        Lien vers les détails de la formation
                                                                                    </a>
                                                                                )}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
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

