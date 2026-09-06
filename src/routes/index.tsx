import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import { alunos, disciplinas, estado, fmt, media, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Secretaria — Gestão Académica" },
      {
        name: "description",
        content:
          "Painel de gestão escolar com alunos, turmas, notas, documentos e estatísticas académicas do ano letivo.",
      },
      { property: "og:title", content: "Painel de Secretaria — Gestão Académica" },
      {
        property: "og:description",
        content: "Visão geral académica: alunos, aprovação, médias e emissão de documentos.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const totalAlunos = turmas.reduce((s, t) => s + t.alunos, 0);
  const medias = alunos.map((a) => media(a.notas));
  const aprovacao = Math.round(
    (medias.filter((m) => estado(m) === "Aprovado").length / medias.length) * 100,
  );
  const mediaGeral = medias.reduce((s, m) => s + m, 0) / medias.length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Painel de secretaria"
        title="Visão geral académica"
        action={
          <Link
            to="/notas"
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40 flex items-center gap-2"
          >
            <span className="size-4 shrink-0">⇩</span>Lançar notas
          </Link>
        }
      />

      <section className="px-8 grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Total de alunos</p>
          <p className="text-3xl font-semibold mt-2 leading-none">{totalAlunos}</p>
          <p className="text-[11px] text-pass mt-2">▲ 3,2% face ao trimestre</p>
        </div>
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Taxa de aprovação</p>
          <p className="text-3xl font-semibold mt-2 leading-none">
            {aprovacao}
            <span className="text-lg text-mut">%</span>
          </p>
          <div className="h-1.5 rounded-full bg-surface-strong mt-3">
            <div className="h-full rounded-full bg-pass" style={{ width: `${aprovacao}%` }} />
          </div>
        </div>
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Média geral</p>
          <p className="text-3xl font-semibold mt-2 leading-none">
            {fmt(mediaGeral)}
            <span className="text-lg text-mut">/20</span>
          </p>
          <p className="text-[11px] text-mut mt-2">Objectivo: 12,0</p>
        </div>
        <div className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Turmas ativas</p>
          <p className="text-3xl font-semibold mt-2 leading-none">{turmas.length}</p>
          <p className="text-[11px] text-mut mt-2">2.º ciclo · 4 turmas</p>
        </div>
      </section>

      <section className="px-8 mt-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Grelha de lançamento de notas · Trimestre 2</h2>
            <span className="text-[11px] text-mut">Média automática</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                <th className="text-left font-medium py-2">Aluno</th>
                <th className="text-center font-medium py-2">T1</th>
                <th className="text-center font-medium py-2">T2</th>
                <th className="text-center font-medium py-2">T3</th>
                <th className="text-center font-medium py-2">Média</th>
              </tr>
            </thead>
            <tbody className="text-mut">
              {alunos.slice(0, 5).map((a) => {
                const m = media(a.notas);
                const e = estado(m);
                return (
                  <tr key={a.numero} className="border-b border-line/60 last:border-0">
                    <td className="py-2.5 text-foreground">{a.nome}</td>
                    <td className="text-center">{a.notas.t1}</td>
                    <td className="text-center">{a.notas.t2}</td>
                    <td className="text-center">{a.notas.t3}</td>
                    <td className="text-center">
                      <span
                        className={`font-semibold ${
                          e === "Aprovado" ? "text-pass" : e === "Recurso" ? "text-warn" : "text-fail"
                        }`}
                      >
                        {fmt(m)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-5 glass rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Aprovação por disciplina</h2>
          <div className="space-y-3">
            {disciplinas.slice(0, 5).map((d) => (
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
          <div className="px-5 py-4 flex items-center justify-between border-b border-line">
            <h2 className="text-sm font-semibold">Alunos</h2>
            <div className="flex items-center gap-2">
              {["Aprovado", "Reprovado", "Recurso"].map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-1 rounded-full bg-surface ring-1 ring-white/10 text-mut"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                <th className="text-left font-medium py-2.5 px-5">Nº</th>
                <th className="text-left font-medium py-2.5">Nome</th>
                <th className="text-left font-medium py-2.5">Turma</th>
                <th className="text-left font-medium py-2.5">Média</th>
                <th className="text-right font-medium py-2.5 pr-5">Estado</th>
              </tr>
            </thead>
            <tbody className="text-mut">
              {alunos.slice(0, 4).map((a) => {
                const m = media(a.notas);
                return (
                  <tr key={a.numero} className="border-b border-line/60 last:border-0">
                    <td className="py-2.5 px-5 text-mut">{a.numero}</td>
                    <td className="py-2.5 text-foreground">{a.nome}</td>
                    <td className="py-2.5">{a.turma}</td>
                    <td className="py-2.5">{fmt(m)}</td>
                    <td className="py-2.5 pr-5 text-right">
                      <EstadoBadge estado={estado(m)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-8 mt-4">
        <h2 className="text-sm font-semibold mb-4">Emissão de documentos</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { t: "Boletins", d: "Boletim individual por aluno e trimestre.", i: "📄", c: "text-brand" },
            { t: "Mini pautas", d: "Pauta simplificada por turma e disciplina.", i: "📊", c: "text-cool" },
            { t: "Certificados", d: "Certificado de conclusão do ciclo de estudos.", i: "🏆", c: "text-accent" },
            { t: "Declarações", d: "Declaração de matrícula e frequência escolar.", i: "📜", c: "text-pass" },
          ].map((doc) => (
            <div key={doc.t} className="glass clip p-4">
              <div className={`size-9 rounded-lg bg-surface ring-1 ring-white/10 grid place-items-center text-sm mb-3 ${doc.c}`}>
                {doc.i}
              </div>
              <p className="text-sm font-medium">{doc.t}</p>
              <p className="text-[11px] text-mut mt-1">{doc.d}</p>
              <Link to="/documentos" className="mt-3 inline-block text-[11px] text-brand font-medium">
                Emitir →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
