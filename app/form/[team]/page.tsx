import { supabase } from "@/lib/supabase";
import FormWrapper from "@/app/form/[team]/FormWrapper";

type TeamPageProps = {
    params: Promise<{
        team: string;
    }>;
};

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

export default async function TeamPage({ params }: TeamPageProps) {
    const { team } = await params;

    const { data: equipe, error: equipeError } = await supabase
        .from("equipes")
        .select("reference, name, answer, is_finished")
        .eq("reference", team)
        .maybeSingle();

    const { data: techniciens, error: techniciensError } = await supabase
        .from("techniciens")
        .select("id, nom, prenom, equipe")
        .eq("equipe", team)
        .order("nom");

    const { data: formations, error: formationsError } = await supabase
        .from("formations")
        .select("id, name, link")
        .order("name");

    if (equipeError || techniciensError || formationsError) {
        return (
            <div>
                <h1>Equipe {team}</h1>
                <p>Erreur lors du chargement des données.</p>
            </div>
        );
    }

    const equipeNom = equipe?.name ?? team;
    const liste = techniciens ?? [];
    const listeFormations = formations ?? [];
    const savedData = equipe?.answer;
    const isFinished = equipe?.is_finished ?? false;

    return (
        <div>
            <h1>Equipe {equipeNom}</h1>
            {liste.length === 0 ? (
                <p>Aucun technicien trouve pour cette equipe.</p>
            ) : (
                <FormWrapper
                    techniciens={liste as Technicien[]}
                    formations={listeFormations as Formation[]}
                    equipeReference={team}
                    initialData={savedData}
                    isFinished={isFinished}
                />
            )}
        </div>
    );
}