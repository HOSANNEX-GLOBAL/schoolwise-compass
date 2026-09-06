import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { alunos, disciplinas, estado, fmt, media, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/estatisticas")({
  head: () => ({
    meta: [
      { title: "Estatísticas Académicas — Gestão Académica" },
      {
        name: "description",
        content:
          "Relatórios de aprovação e reprovação, desempenho por turma e por disciplina ao longo do ano letivo.",
      },
      { property: "og:title", content: "Estatísticas Académicas — Gestão Académica" },
      { property: "og:description", content: "Indicadores de aproveitamento escolar e relatórios." },
    ],
  }),
  component: EstatisticasPage,
});

function EstatisticasPage() {
  const medias = alunos.map((a) => media(a.notas));
  const aprovados = medias.filter((m) => estado(m) === "Aprovado").length;
  const recursos = medias.filter((m) => estado(m) === "Recurso").length;
  const reprovados = medias.filter((m) => estado(m) === "Reprovado").length;
  const total = medias.length;
  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Estatísticas"
        title="Relatórios académicos"
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            Exportar relatório
          </button>
        }
      />

      <section className="px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Aprovados</p>
          <p className="text-3xl font-semibold mt-2 leading-none text-pass">{pct(aprovados)}%</p>
          <p className="text-[11px] text-mut mt-2">{aprovados} de {total} alunos avaliados</p>
        </div>
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Em recurso</p>
          <p className="text-3xl font-semibold mt-2 leading-none text-warn">{pct(recursos)}%</p>
          <p className="text-[11px] text-mut mt-2">{recursos} alunos em exame de recurso</p>
        </div>
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Reprovados</p>
          <p className="text-3xl font-semibold mt-2 leading-none text-fail">{pct(reprovados)}%</p>
          <p className="text-[11px] text-mut mt-2">{reprovados} alunos sem aproveitamento</p>
        </div>
      </section>

      <section className="px-8 mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Desempenho por turma</h2>
          <div className="space-y-3">
            {turmas.map((t) => (
              <div key={t.nome}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.nome}</span>
                  <span className="text-mut">{fmt(t.mediaTurma)} /20</span>
                </div>
                <div className="h-2 rounded-full bg-surface-strong">
                  <div
                    className={`h-full rounded-full ${t.mediaTurma >= 12 ? "bg-brand" : "bg-warn"}`}
                    style={{ width: `${(t.mediaTurma / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Desempenho por disciplina</h2>
          <div className="space-y-3">
            {disciplinas.map((d) => (
              <div key={d.codigo}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{d.nome}</span>
                  <span className="text-mut">{d.aprovacao}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-strong">
                  <div
                    className={`h-full rounded-full ${d.aprovacao >= 75 ? "bg-brand" : "bg-cool"}`}
                    style={{ width: `${d.aprovacao}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 mt-4">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="text-sm font-semibold">Relatório de aproveitamento por aluno</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Aluno</th>
                  <th className="text-left font-medium py-2.5">Turma</th>
                  <th className="text-center font-medium py-2.5">T1</th>
                  <th className="text-center font-medium py-2.5">T2</th>
                  <th className="text-center font-medium py-2.5">T3</th>
                  <th className="text-right font-medium py-2.5 pr-5">Média final</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {alunos.map((a) => (
                  <tr key={a.numero} className="border-b border-line/60 last:border-0 hover:bg-surface">
                    <td className="py-2.5 px-5 text-foreground">{a.nome}</td>
                    <td className="py-2.5">{a.turma}</td>
                    <td className="py-2.5 text-center">{a.notas.t1}</td>
                    <td className="py-2.5 text-center">{a.notas.t2}</td>
                    <td className="py-2.5 text-center">{a.notas.t3}</td>
                    <td className="py-2.5 pr-5 text-right font-medium text-foreground">
                      {fmt(media(a.notas))}
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
