import { supabase } from "@/lib/supabase";
import Team from "@/app/form/Team";

export default async function AboutPage() {
    const { data, error } = await supabase
        .from("equipes")
        .select("reference, name, is_finished")
        .order("name");

    const equipes = data ?? [];

    return (
        <div>
            <h1>Sondage</h1>
            <p>Sur cette page, vous pouvez répondre au sondage ou consulter votre sondage si vous avez déjà envoyé la réponse.</p>

            {error ? (
                <p>Erreur lors du chargement des equipes.</p>
            ) : (
                <Team equipes={equipes} />
            )}

        </div>
    );
}