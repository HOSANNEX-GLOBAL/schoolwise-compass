import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { anoLetivo, fmt, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/turmas")({
  head: () => ({
    meta: [
      { title: "Gestão de Turmas — Gestão Académica" },
      {
        name: "description",
        content: "Turmas do ano letivo com diretor de turma, sala, número de alunos e média.",
      },
      { property: "og:title", content: "Gestão de Turmas — Gestão Académica" },
      { property: "og:description", content: "Organize turmas, salas e diretores de turma." },
    ],
  }),
  component: TurmasPage,
});

function TurmasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title={`Turmas · Ano letivo ${anoLetivo}`}
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            + Nova turma
          </button>
        }
      />

      <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {turmas.map((t) => (
          <article key={t.nome} className="glass clip p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-mut">{t.ciclo}</p>
                <h2 className="text-xl font-semibold mt-1">{t.nome}</h2>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full bg-surface ring-1 ring-white/10 text-mut">
                Sala {t.sala}
              </span>
            </div>
            <p className="text-sm text-mut mt-3">Diretor(a): {t.diretor}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-mut">Alunos</p>
                <p className="text-lg font-semibold">{t.alunos}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-mut">Média da turma</p>
                <p className="text-lg font-semibold text-brand">{fmt(t.mediaTurma)}</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-surface-strong mt-3">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(t.mediaTurma / 20) * 100}%` }} />
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
