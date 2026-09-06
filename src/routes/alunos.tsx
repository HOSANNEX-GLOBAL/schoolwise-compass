import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import { alunos, estado, fmt, media, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/alunos")({
  head: () => ({
    meta: [
      { title: "Gestão de Alunos — Gestão Académica" },
      {
        name: "description",
        content: "Pesquise, filtre e acompanhe alunos por turma, média e estado de aprovação.",
      },
      { property: "og:title", content: "Gestão de Alunos — Gestão Académica" },
      { property: "og:description", content: "Lista completa de alunos com médias e estados." },
    ],
  }),
  component: AlunosPage,
});

function AlunosPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [turma, setTurma] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const lista = useMemo(
    () =>
      alunos
        .map((a) => ({ ...a, m: media(a.notas) }))
        .filter((a) => {
          const q = pesquisa.trim().toLowerCase();
          const okQ = !q || a.nome.toLowerCase().includes(q) || a.numero.includes(q);
          const okT = turma === "Todas" || a.turma === turma;
          const okE = filtroEstado === "Todos" || estado(a.m) === filtroEstado;
          return okQ && okT && okE;
        }),
    [pesquisa, turma, filtroEstado],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Alunos"
        action={
          <button className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40">
            + Novo aluno
          </button>
        }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 flex flex-wrap items-center gap-2 border-b border-line">
            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Nome ou nº de processo"
              className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm placeholder:text-mut w-56 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option className="bg-ink2">Todas</option>
              {turmas.map((t) => (
                <option key={t.nome} className="bg-ink2">
                  {t.nome}
                </option>
              ))}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              {["Todos", "Aprovado", "Recurso", "Reprovado"].map((s) => (
                <option key={s} className="bg-ink2">
                  {s}
                </option>
              ))}
            </select>
            <span className="ml-auto text-[11px] text-mut">
              {lista.length} de {alunos.length} alunos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Nº</th>
                  <th className="text-left font-medium py-2.5">Nome</th>
                  <th className="text-left font-medium py-2.5">Turma</th>
                  <th className="text-left font-medium py-2.5">Encarregado</th>
                  <th className="text-left font-medium py-2.5">Média</th>
                  <th className="text-right font-medium py-2.5 pr-5">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {lista.map((a) => (
                  <tr key={a.numero} className="border-b border-line/60 last:border-0 hover:bg-surface">
                    <td className="py-2.5 px-5">{a.numero}</td>
                    <td className="py-2.5 text-foreground">{a.nome}</td>
                    <td className="py-2.5">{a.turma}</td>
                    <td className="py-2.5">{a.encarregado}</td>
                    <td className="py-2.5">{fmt(a.m)}</td>
                    <td className="py-2.5 pr-5 text-right">
                      <EstadoBadge estado={estado(a.m)} />
                    </td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-mut">
                      Nenhum aluno corresponde aos filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
