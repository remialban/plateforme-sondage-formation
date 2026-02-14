"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Equipe = {
    reference: string;
    name: string;
    is_finished: boolean;
};

export default function Team({ equipes }: { equipes: Equipe[] }) {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const searchLower = search.toLowerCase();
    const filtered = equipes.filter((equipe) => {
        return (
            equipe.name.toLowerCase().includes(searchLower) ||
            equipe.reference.toLowerCase().includes(searchLower)
        );
    });

    const onSelectButton = (id: string) => {
        router.push("/form/" + id);
    };

    return (
        <div>
            <label htmlFor="team" className="form-label fw-bold">Sélectionner votre équipe :</label>

            <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                    🔍
                </span>
                <input
                    type="search"
                    className="form-control"
                    placeholder="Rechercher une équipe"
                    name=""
                    id="team"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table className="table table-striped bg-white">
                <thead className="bg-primary">
                    <tr className={"bg-primary"}>
                        <th scope="col">Reference</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((item) => (
                        <tr key={item.reference}>
                            <td>{item.reference}</td>
                            <td>{item.name}</td>
                            <td>
                                <button
                                    className={`btn ${item.is_finished ? 'btn-success' : 'btn-primary'}`}
                                    onClick={() => onSelectButton(item.reference)}
                                >
                                    {item.is_finished ? '👁️ Consulter' : '✏️ Remplir'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}