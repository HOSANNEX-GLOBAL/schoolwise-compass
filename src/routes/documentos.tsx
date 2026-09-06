import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { alunos, documentos, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos Escolares — Gestão Académica" },
      {
        name: "description",
        content:
          "Emissão de boletins, mini pautas, pautas trimestrais e finais, certificados e declarações escolares.",
      },
      { property: "og:title", content: "Documentos Escolares — Gestão Académica" },
      { property: "og:description", content: "Emita documentos oficiais por aluno, turma ou trimestre." },
    ],
  }),
  component: DocumentosPage,
});

function DocumentosPage() {
  const [aluno, setAluno] = useState(alunos[0]!.nome);
  const [turma, setTurma] = useState(turmas[0]!.nome);

  return (
    <AppShell>
      <PageHeader eyebrow="Documentos" title="Emissão de documentos escolares" />

      <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {documentos.map((d) => (
          <article key={d.titulo} className="glass clip p-5">
            <div className={`size-9 rounded-lg bg-surface ring-1 ring-white/10 grid place-items-center text-sm mb-3 ${d.cor}`}>
              {d.icone}
            </div>
            <p className="text-sm font-medium">{d.titulo}</p>
            <p className="text-[11px] text-mut mt-1">{d.descricao}</p>
            <button
              onClick={() => toast.success(`${d.titulo} em preparação`, { description: "O documento será gerado em PDF." })}
              className="mt-4 text-[11px] text-brand font-medium"
            >
              Emitir →
            </button>
          </article>
        ))}
      </section>

      <section className="px-8 mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3">Emissão individual</h2>
          <label className="text-[11px] text-mut block mb-1" htmlFor="aluno">
            Aluno
          </label>
          <select
            id="aluno"
            value={aluno}
            onChange={(e) => setAluno(e.target.value)}
            className="w-full bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
          >
            {alunos.map((a) => (
              <option key={a.numero} className="bg-ink2">
                {a.nome}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Boletim", "Certificado", "Declaração"].map((t) => (
              <button
                key={t}
                onClick={() => toast.success(`${t} de ${aluno}`, { description: "Documento pronto para impressão." })}
                className="text-xs px-3 py-2 rounded-md bg-surface ring-1 ring-white/10 hover:bg-surface-strong"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3">Emissão por turma</h2>
          <label className="text-[11px] text-mut block mb-1" htmlFor="turma">
            Turma
          </label>
          <select
            id="turma"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            className="w-full bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
          >
            {turmas.map((t) => (
              <option key={t.nome} className="bg-ink2">
                {t.nome}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Mini pauta", "Pauta trimestral", "Pauta final"].map((t) => (
              <button
                key={t}
                onClick={() => toast.success(`${t} · ${turma}`, { description: "Documento pronto para impressão." })}
                className="text-xs px-3 py-2 rounded-md bg-surface ring-1 ring-white/10 hover:bg-surface-strong"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
