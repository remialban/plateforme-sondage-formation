import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

interface TechnicienSelection {
    technicienId: number;
}

interface HydroliqueSelection extends TechnicienSelection {
    niveauSouhaite: string;
    priorite: string;
}

interface FroidSelection extends TechnicienSelection {
    typeFormation: string;
    marque?: string;
    modele?: string;
    formationId?: number;
}

interface Answer {
    automatisme?: TechnicienSelection[];
    hydrolique?: HydroliqueSelection[];
    froid?: FroidSelection[];
}

interface FormDataRow {
    equipeReference: string;
    equipeName: string;
    technicienNom: string;
    technicienPrenom: string;
    [key: string]: string | number | boolean | null;
}

async function generateCSVContent(data: FormDataRow[]): Promise<string> {
    if (data.length === 0) return '';

    // Obtenir toutes les colonnes uniques
    const allKeys = new Set<string>();
    data.forEach(row => {
        Object.keys(row).forEach(key => allKeys.add(key));
    });

    // Ordonner les colonnes avec les principales en premier
    const mainColumns = ['equipeReference', 'equipeName', 'technicienNom', 'technicienPrenom'];
    const orderedColumns = [
        ...mainColumns.filter(col => allKeys.has(col)),
        ...Array.from(allKeys).filter(col => !mainColumns.includes(col)),
    ];

    // Créer le header
    const header = orderedColumns.join(',');

    // Créer les lignes
    const lines = data.map(row =>
        orderedColumns.map(col => {
            const value = row[col] ?? '';
            // Échapper les valeurs contenant des virgules ou des guillemets
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',')
    );

    return [header, ...lines].join('\n');
}

export async function POST(request: NextRequest) {
    try {
        const { equipeReferences } = await request.json();

        if (!equipeReferences || !Array.isArray(equipeReferences)) {
            return NextResponse.json(
                { error: 'Paramètres invalides' },
                { status: 400 }
            );
        }

        // Récupérer toutes les formations une seule fois
        const { data: formations } = await supabase
            .from('formations')
            .select('id, name');

        const formationMap = new Map(
            (formations || []).map(f => [f.id, f.name])
        );

        const zip = new JSZip();

        // Créer des tableaux de données pour chaque domaine
        const automatismeData: FormDataRow[] = [];
        const hydroliquenData: FormDataRow[] = [];
        const froidData: FormDataRow[] = [];

        // Pour chaque équipe, récupérer les données
        for (const equipeRef of equipeReferences) {
            const { data: equipe } = await supabase
                .from('equipes')
                .select('reference, name, answer')
                .eq('reference', equipeRef)
                .maybeSingle();

            if (!equipe) continue;

            // Récupérer les techniciens de l'équipe
            const { data: techniciens } = await supabase
                .from('techniciens')
                .select('id, nom, prenom')
                .eq('equipe', equipeRef);

            // Créer un mapping des techniciens par ID
            const technicienMap = new Map(
                (techniciens || []).map(t => [t.id, { nom: t.nom, prenom: t.prenom }])
            );

            // Si des données sont présentes, les traiter
            if (equipe.answer) {
                const answer: Answer = equipe.answer;

                // Traiter les données Automatisme
                if (answer.automatisme && Array.isArray(answer.automatisme)) {
                    answer.automatisme.forEach((item: TechnicienSelection) => {
                        const tech = technicienMap.get(item.technicienId);
                        if (tech) {
                            automatismeData.push({
                                equipeReference: equipe.reference,
                                equipeName: equipe.name,
                                technicienNom: tech.nom,
                                technicienPrenom: tech.prenom,
                            });
                        }
                    });
                }

                // Traiter les données Hydrolique
                if (answer.hydrolique && Array.isArray(answer.hydrolique)) {
                    answer.hydrolique.forEach((item: HydroliqueSelection) => {
                        const tech = technicienMap.get(item.technicienId);
                        if (tech) {
                            hydroliquenData.push({
                                equipeReference: equipe.reference,
                                equipeName: equipe.name,
                                technicienNom: tech.nom,
                                technicienPrenom: tech.prenom,
                                niveauSouhaite: item.niveauSouhaite || '',
                                priorite: item.priorite || '',
                            });
                        }
                    });
                }

                // Traiter les données Froid
                if (answer.froid && Array.isArray(answer.froid)) {
                    answer.froid.forEach((item: FroidSelection) => {
                        const tech = technicienMap.get(item.technicienId);
                        if (tech) {
                            const formationName = item.formationId ? formationMap.get(item.formationId) || '' : '';
                            froidData.push({
                                equipeReference: equipe.reference,
                                equipeName: equipe.name,
                                technicienNom: tech.nom,
                                technicienPrenom: tech.prenom,
                                typeFormation: item.typeFormation || '',
                                marque: item.marque || '',
                                modele: item.modele || '',
                                formation: formationName,
                            });
                        }
                    });
                }
            }
        }

        // Générer les CSV pour chaque domaine
        const automatismeCSV = await generateCSVContent(automatismeData);
        const hydroliqueCSV = await generateCSVContent(hydroliquenData);
        const froidCSV = await generateCSVContent(froidData);

        // Ajouter les fichiers au ZIP
        if (automatismeCSV) {
            zip.file('Automatisme.csv', automatismeCSV);
        }
        if (hydroliqueCSV) {
            zip.file('Hydrolique.csv', hydroliqueCSV);
        }
        if (froidCSV) {
            zip.file('Froid.csv', froidCSV);
        }

        // Créer le ZIP
        const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

        // Retourner le fichier ZIP
        return new NextResponse(zipBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="export-sondages-${new Date().toISOString().split('T')[0]}.zip"`,
            },
        });

    } catch (err) {
        console.error('Erreur lors de l\'export:', err);
        return NextResponse.json(
            { error: 'Erreur lors de l\'export' },
            { status: 500 }
        );
    }
}

