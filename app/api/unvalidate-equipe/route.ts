import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const equipeReference = formData.get("equipeReference") as string;

        if (!equipeReference) {
            return NextResponse.json(
                { error: "Référence d'équipe manquante" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("equipes")
            .update({ is_finished: false })
            .eq("reference", equipeReference);

        if (error) {
            console.error("Erreur lors de la dé-validation:", error);
            return NextResponse.json(
                { error: "Erreur lors de la dé-validation" },
                { status: 500 }
            );
        }

        // Redirection vers le dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url), {
            status: 303,
        });
    } catch (err) {
        console.error("Erreur inattendue:", err);
        return NextResponse.json(
            { error: "Une erreur inattendue est survenue" },
            { status: 500 }
        );
    }
}

