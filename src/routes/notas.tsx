import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import { alunos, disciplinas, estado, fmt, historico, media, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/notas")({
  head: () => ({
    meta: [
      { title: "Lançamento de Notas — Gestão Académica" },
      {
        name: "description",
        content:
          "Grelha de lançamento de notas por trimestre com cálculo automático de médias e histórico de alterações.",
      },
      { property: "og:title", content: "Lançamento de Notas — Gestão Académica" },
      { property: "og:description", content: "Notas por trimestre, médias automáticas e recursos." },
    ],
  }),
  component: NotasPage,
});

type Linha = { numero: string; nome: string; t1: string; t2: string; t3: string };

function NotasPage() {
  const [disciplina, setDisciplina] = useState(disciplinas[0]!.nome);
  const [turma, setTurma] = useState(turmas[0]!.nome);
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    alunos.map((a) => ({
      numero: a.numero,
      nome: a.nome,
      t1: String(a.notas.t1),
      t2: String(a.notas.t2),
      t3: String(a.notas.t3),
    })),
  );

  const calc = (l: Linha) => {
    const vals = [l.t1, l.t2, l.t3].map((v) => Number(v)).filter((v) => !Number.isNaN(v) && v > 0);
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
  };

  const mediaGrelha = useMemo(() => {
    const ms = linhas.map(calc);
    return ms.reduce((s, m) => s + m, 0) / ms.length;
  }, [linhas]);

  const set = (numero: string, campo: "t1" | "t2" | "t3", valor: string) => {
    if (valor !== "" && !/^\d{0,2}$/.test(valor)) return;
    if (valor !== "" && Number(valor) > 20) return;
    setLinhas((prev) => prev.map((l) => (l.numero === numero ? { ...l, [campo]: valor } : l)));
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliações"
        title="Lançamento e gestão de notas"
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            Gravar lançamento
          </button>
        }
      />

      <section className="px-8 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 glass rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-semibold">Grelha de notas · Trimestre 2</h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                {turmas.map((t) => (
                  <option key={t.nome} className="bg-ink2">
                    {t.nome}
                  </option>
                ))}
              </select>
              <select
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                {disciplinas.map((d) => (
                  <option key={d.codigo} className="bg-ink2">
                    {d.nome}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-mut">Média automática</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2">Aluno</th>
                  <th className="text-center font-medium py-2">T1</th>
                  <th className="text-center font-medium py-2">T2</th>
                  <th className="text-center font-medium py-2">T3</th>
                  <th className="text-center font-medium py-2">Média</th>
                  <th className="text-right font-medium py-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {linhas.map((l) => {
                  const m = calc(l);
                  const e = estado(m);
                  return (
                    <tr key={l.numero} className="border-b border-line/60 last:border-0">
                      <td className="py-2 text-foreground">{l.nome}</td>
                      {(["t1", "t2", "t3"] as const).map((c) => (
                        <td key={c} className="py-2 text-center">
                          <input
                            inputMode="numeric"
                            aria-label={`${c.toUpperCase()} de ${l.nome}`}
                            value={l[c]}
                            onChange={(ev) => set(l.numero, c, ev.target.value)}
                            className="w-12 text-center bg-surface ring-1 ring-white/10 rounded-md py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                          />
                        </td>
                      ))}
                      <td className="py-2 text-center">
                        <span
                          className={`font-semibold ${
                            e === "Aprovado" ? "text-pass" : e === "Recurso" ? "text-warn" : "text-fail"
                          }`}
                        >
                          {fmt(m)}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <EstadoBadge estado={e} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-mut mt-3">
            Média da grelha: <span className="text-foreground font-medium">{fmt(mediaGrelha)}</span> /20 ·
            aprovação a partir de 12,0 · recurso entre 9,5 e 11,9
          </p>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="glass clip p-5">
            <h2 className="text-sm font-semibold mb-1">Gestão de recursos</h2>
            <p className="text-[11px] text-mut mb-3">Alunos em exame de recurso nesta grelha.</p>
            <div className="space-y-2">
              {linhas
                .filter((l) => estado(calc(l)) !== "Aprovado")
                .map((l) => (
                  <div key={l.numero} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{l.nome}</span>
                    <span className="text-mut">{fmt(calc(l))}</span>
                  </div>
                ))}
              {linhas.every((l) => estado(calc(l)) === "Aprovado") && (
                <p className="text-sm text-mut">Nenhum aluno em recurso.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Histórico de alterações</h2>
            <ol className="space-y-3">
              {historico.map((h) => (
                <li key={h.data} className="border-l border-line pl-3">
                  <p className="text-[11px] text-mut">
                    {h.data} · {h.utilizador}
                  </p>
                  <p className="text-sm">{h.descricao}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
