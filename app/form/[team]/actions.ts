'use server';

import { supabase } from '@/lib/supabase';

type FormData = {
    automatisme: Array<{ technicienId: number }>;
    hydrolique: Array<{
        technicienId: number;
        niveauSouhaite: string;
        priorite: string
    }>;
    froid: Array<{
        technicienId: number;
        typeFormation: string;
        marque?: string;
        modele?: string;
        formationId?: number
    }>;
};

export async function saveFormData(equipeReference: string, data: FormData) {
    try {
        const { error } = await supabase
            .from('equipes')
            .update({ answer: data })
            .eq('reference', equipeReference);

        if (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return { success: false, error: error.message };
        }

        console.log('Données sauvegardées avec succès');
        return { success: true };
    } catch (err) {
        console.error('Erreur inattendue:', err);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function saveAndValidateFormData(equipeReference: string, data: FormData) {
    try {
        const { error } = await supabase
            .from('equipes')
            .update({ answer: data, is_finished: true })
            .eq('reference', equipeReference);

        if (error) {
            console.error('Erreur lors de la sauvegarde et validation:', error);
            return { success: false, error: error.message };
        }

        console.log('Données sauvegardées et formulaire validé avec succès');
        return { success: true };
    } catch (err) {
        console.error('Erreur inattendue:', err);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

