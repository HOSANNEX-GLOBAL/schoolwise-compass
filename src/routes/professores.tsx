import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { professores } from "@/lib/school-data";

export const Route = createFileRoute("/professores")({
  head: () => ({
    meta: [
      { title: "Gestão de Professores — Gestão Académica" },
      {
        name: "description",
        content: "Corpo docente com disciplina lecionada, turmas atribuídas e situação contratual.",
      },
      { property: "og:title", content: "Gestão de Professores — Gestão Académica" },
      { property: "og:description", content: "Atribuição de turmas e disciplinas ao corpo docente." },
    ],
  }),
  component: ProfessoresPage,
});

function ProfessoresPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Professores"
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            + Novo professor
          </button>
        }
      />

      <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {professores.map((p) => (
          <article key={p.nome} className="glass clip p-5">
            <div className="size-10 rounded-lg bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-brand font-semibold">
              {p.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <p className="text-sm font-medium mt-3">{p.nome}</p>
            <p className="text-[11px] text-mut">{p.disciplina}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.turmas.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-surface ring-1 ring-white/10 text-mut">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-mut mt-3 break-all">{p.contacto}</p>
            <p className={`text-[11px] mt-1 ${p.situacao === "Efetivo" ? "text-pass" : "text-warn"}`}>
              {p.situacao}
            </p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
