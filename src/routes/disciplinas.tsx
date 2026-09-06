import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { disciplinas } from "@/lib/school-data";

export const Route = createFileRoute("/disciplinas")({
  head: () => ({
    meta: [
      { title: "Gestão de Disciplinas — Gestão Académica" },
      {
        name: "description",
        content: "Disciplinas com carga horária, professor responsável e taxa de aprovação.",
      },
      { property: "og:title", content: "Gestão de Disciplinas — Gestão Académica" },
      { property: "og:description", content: "Plano curricular e desempenho por disciplina." },
    ],
  }),
  component: DisciplinasPage,
});

function DisciplinasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Disciplinas"
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            + Nova disciplina
          </button>
        }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Código</th>
                  <th className="text-left font-medium py-2.5">Disciplina</th>
                  <th className="text-left font-medium py-2.5">Carga semanal</th>
                  <th className="text-left font-medium py-2.5">Professor responsável</th>
                  <th className="text-left font-medium py-2.5 pr-5">Aprovação</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {disciplinas.map((d) => (
                  <tr key={d.codigo} className="border-b border-line/60 last:border-0 hover:bg-surface">
                    <td className="py-2.5 px-5 font-medium text-brand">{d.codigo}</td>
                    <td className="py-2.5 text-foreground">{d.nome}</td>
                    <td className="py-2.5">{d.cargaHoraria} h</td>
                    <td className="py-2.5">{d.professor}</td>
                    <td className="py-2.5 pr-5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-28 rounded-full bg-surface-strong">
                          <div
                            className={`h-full rounded-full ${d.aprovacao >= 75 ? "bg-pass" : "bg-warn"}`}
                            style={{ width: `${d.aprovacao}%` }}
                          />
                        </div>
                        <span className="text-xs">{d.aprovacao}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
