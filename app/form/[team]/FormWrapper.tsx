'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveFormData, saveAndValidateFormData } from './actions';
import TechnicienForm from './TechnicienForm';
import HydroliqueForm from './HydroliqueForm';
import FroidForm from './FroidForm';

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
};

type HydroliqueSelection = {
    technicienId: number;
    niveauSouhaite: string;
    priorite: string;
};

type FroidSelection = {
    technicienId: number;
    typeFormation: string;
    marque?: string;
    modele?: string;
    formationId?: number;
};

type SavedFormData = {
    automatisme?: TechnicienSelection[];
    hydrolique?: HydroliqueSelection[];
    froid?: FroidSelection[];
};

type Props = {
    techniciens: Technicien[];
    formations: Formation[];
    equipeReference: string;
    initialData?: SavedFormData | null;
    isFinished?: boolean;
};

export default function FormWrapper({ techniciens, formations, equipeReference, initialData, isFinished = false }: Props) {
    const router = useRouter();
    const [technicienSelections, setTechnicienSelections] = useState<TechnicienSelection[]>(
        initialData?.automatisme || []
    );
    const [hydroliqueSelections, setHydroliqueSelections] = useState<HydroliqueSelection[]>(
        initialData?.hydrolique || []
    );
    const [froidSelections, setFroidSelections] = useState<FroidSelection[]>(
        initialData?.froid || []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Validation pour Hydrolique
        hydroliqueSelections.forEach((selection, index) => {
            if (!selection.niveauSouhaite) {
                errors.push(`Hydrolique - Technicien ${index + 1}: Niveau souhaité manquant`);
            }
            if (!selection.priorite) {
                errors.push(`Hydrolique - Technicien ${index + 1}: Priorité manquante`);
            }
        });

        // Validation pour Froid
        froidSelections.forEach((selection, index) => {
            if (!selection.typeFormation) {
                errors.push(`Froid - Technicien ${index + 1}: Type de formation manquant`);
            }
            if (selection.typeFormation === 'formation_constructeur') {
                if (!selection.marque || selection.marque.trim() === '') {
                    errors.push(`Froid - Technicien ${index + 1}: Marque manquante`);
                }
                if (!selection.modele || selection.modele.trim() === '') {
                    errors.push(`Froid - Technicien ${index + 1}: Modèle manquant`);
                }
            }
            if (selection.typeFormation === 'formation_generalisee') {
                if (!selection.formationId) {
                    errors.push(`Froid - Technicien ${index + 1}: Formation non sélectionnée`);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSave = async () => {
        const data = {
            automatisme: technicienSelections,
            hydrolique: hydroliqueSelections,
            froid: froidSelections
        };

        console.log('Données du formulaire:', data);

        setIsSubmitting(true);

        try {
            const result = await saveFormData(equipeReference, data);

            if (!result.success) {
                console.error('Erreur lors de la sauvegarde:', result.error);
                alert('Erreur lors de la sauvegarde des données: ' + result.error);
            } else {
                console.log('Données sauvegardées avec succès');
                alert('Formulaire sauvegardé avec succès ! Vous pouvez fermer cette page et revenir plus tard ! ℹ️ Pour rappel, vous devez cliquer sur "Enregistrer et Valider" pour valider définitivement le formulaire une fois que vous avez terminé de le remplir.');
            }
        } catch (err) {
            console.error('Erreur inattendue:', err);
            alert('Une erreur inattendue est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveAndValidate = async () => {
        const data = {
            automatisme: technicienSelections,
            hydrolique: hydroliqueSelections,
            froid: froidSelections
        };

        // Validation du formulaire
        const validation = validateForm();
        if (!validation.isValid) {
            alert('Le formulaire est incomplet:\n\n' + validation.errors.join('\n'));
            return;
        }

        // Message d'avertissement avant validation
        const confirmation = confirm(
            '⚠️ ATTENTION ⚠️\n\n' +
            'Une fois validé, ce formulaire ne pourra plus être modifié.\n\n' +
            'Êtes-vous sûr de vouloir valider définitivement ce formulaire ?'
        );

        if (!confirmation) {
            return;
        }

        console.log('Données du formulaire:', data);

        setIsSubmitting(true);

        try {
            const result = await saveAndValidateFormData(equipeReference, data);

            if (!result.success) {
                console.error('Erreur lors de la sauvegarde et validation:', result.error);
                alert('Erreur lors de la sauvegarde et validation: ' + result.error);
            } else {
                console.log('Données sauvegardées et formulaire validé avec succès');
                alert('Formulaire sauvegardé et validé avec succès !');
                router.refresh();
            }
        } catch (err) {
            console.error('Erreur inattendue:', err);
            alert('Une erreur inattendue est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isFinished && (
                <div className="alert alert-info mb-4" role="alert">
                    <h4 className="alert-heading">✅ Formulaire validé</h4>
                    <p className="mb-0">
                        Ce formulaire a été validé et ne peut plus être modifié.
                        Les données ci-dessous sont en lecture seule.
                    </p>
                </div>
            )}

            <TechnicienForm
                techniciens={techniciens}
                onSelectionsChange={setTechnicienSelections}
                initialSelections={initialData?.automatisme || []}
                isReadOnly={isFinished}
            />
            <HydroliqueForm
                techniciens={techniciens}
                onSelectionsChange={setHydroliqueSelections}
                initialSelections={initialData?.hydrolique || []}
                isReadOnly={isFinished}
            />
            <FroidForm
                techniciens={techniciens}
                formations={formations}
                onSelectionsChange={setFroidSelections}
                initialSelections={initialData?.froid || []}
                isReadOnly={isFinished}
            />

            {!isFinished && (
                <div className="d-flex justify-content-end gap-3 mt-4 mb-5">
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg"
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer et revenir plus tard'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-lg"
                        onClick={handleSaveAndValidate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer et envoyer la réponse'}
                    </button>
                </div>
            )}
        </>
    );
}

