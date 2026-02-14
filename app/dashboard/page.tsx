import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { UnvalidateButton } from "./UnvalidateButton";
import { ExportButton } from "./ExportButton";

type Equipe = {
    reference: string;
    name: string;
    is_finished: boolean;
};

export default async function DashboardPage() {
    const { data: equipes, error } = await supabase
        .from("equipes")
        .select("reference, name, is_finished")
        .order("name");

    if (error || !equipes) {
        return (
            <div className="container mt-5">
                <h1>Dashboard</h1>
                <p className="text-danger">Erreur lors du chargement des équipes.</p>
            </div>
        );
    }

    const equipesValidees = equipes.filter(e => e.is_finished === true);
    const equipesNonValidees = equipes.filter(e => e.is_finished !== true);
    const totalEquipes = equipes.length;
    const nombreValidees = equipesValidees.length;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>📊 Dashboard des Sondages</h1>
                <ExportButton equipes={equipes} />
            </div>

            {/* Statistiques */}
            <div className="row mb-5">
                <div className="col-md-6">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Équipes ayant répondu</h5>
                            <p className="card-text">
                                <span className="fs-3 fw-bold text-success">{nombreValidees}</span>
                                <span className="text-muted"> / {totalEquipes}</span>
                            </p>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{ width: totalEquipes > 0 ? `${(nombreValidees / totalEquipes) * 100}%` : "0%" }}
                                    aria-valuenow={nombreValidees}
                                    aria-valuemin={0}
                                    aria-valuemax={totalEquipes}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h5 className="card-title">Équipes n&apos;ayant pas répondu</h5>
                            <p className="card-text">
                                <span className="fs-3 fw-bold text-warning">{equipesNonValidees.length}</span>
                                <span className="text-muted"> / {totalEquipes}</span>
                            </p>
                            <div className="progress">
                                <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: totalEquipes > 0 ? `${(equipesNonValidees.length / totalEquipes) * 100}%` : "0%" }}
                                    aria-valuenow={equipesNonValidees.length}
                                    aria-valuemin={0}
                                    aria-valuemax={totalEquipes}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Équipes validées */}
            <div className="row mb-5">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">✅ Équipes ayant répondu ({nombreValidees})</h5>
                        </div>
                        <div className="card-body">
                            {equipesValidees.length === 0 ? (
                                <p className="text-muted mb-0">Aucune équipe n&apos;a encore répondu.</p>
                            ) : (
                                <div className="list-group bg-white">
                                    {equipesValidees.map((equipe: Equipe) => (
                                        <div key={equipe.reference} className="list-group-item list-group-item-action">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Link
                                                    href={`/form/${equipe.reference}`}
                                                    className="text-decoration-none flex-grow-1"
                                                >
                                                    <div>
                                                        <h6 className="mb-1">{equipe.name}</h6>
                                                        <small className="text-muted">{equipe.reference}</small>
                                                    </div>
                                                </Link>
                                                <UnvalidateButton equipeReference={equipe.reference} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Équipes non validées */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">⏳ Équipes n&apos;ayant pas répondu ({equipesNonValidees.length})</h5>
                        </div>
                        <div className="card-body">
                            {equipesNonValidees.length === 0 ? (
                                <p className="text-muted mb-0">Toutes les équipes ont répondu ! 🎉</p>
                            ) : (
                                <div className="list-group bg-white">
                                    {equipesNonValidees.map((equipe: Equipe) => (
                                        <Link
                                            key={equipe.reference}
                                            href={`/form/${equipe.reference}`}
                                            className="list-group-item list-group-item-action text-decoration-none"
                                        >
                                            <div>
                                                <h6 className="mb-1">{equipe.name}</h6>
                                                <small className="text-muted">{equipe.reference}</small>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


