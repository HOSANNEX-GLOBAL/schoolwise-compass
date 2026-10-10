import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import { Aluno, AlunoAPI } from "@/types/student.ds";
import { anoLetivo,  estado,  maxNotaDaTurma, turmas } from "@/lib/school-data";
import { useQuery } from "@tanstack/react-query";
import { Turma, TurmaApi } from "@/types/classroom.ds";
import { getClassrooms } from "@/api/classrooms";
import { getStudents } from "@/api/students";

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
  // const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  // const [turmasAtuais, setTurmasAtuais] = useState<Turma[]>(turmas);
  const [pesquisa, setPesquisa] = useState("");
  const [turma, setTurma] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoAluno, setNovoAluno] = useState({} as any);


  function adicionarAluno(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ano = anoLetivo.slice(0, 4);
    const maiorSequencial = alunos.reduce((maior, aluno) => {
      const [anoDoAluno, sequencial] = aluno.numero.split("-");
      if (anoDoAluno !== ano) return maior;
      return Math.max(maior, Number(sequencial) || 0);
    }, 0);

    const aluno: any = {
      numero: `${ano}-${String(maiorSequencial + 1).padStart(4, "0")}`,
      nome: novoAluno.nome.trim(),
      turma: novoAluno.turma,
      encarregado: novoAluno.encarregado.trim(),
      dataNascimento: novoAluno.dataNascimento,
      contactoEncarregado: novoAluno.contactoEncarregado.trim(),
      estadoMatricula: novoAluno.estadoMatricula,
      notas: {
        t1: Number(novoAluno.t1),
        t2: Number(novoAluno.t2),
        t3: Number(novoAluno.t3),
      },
    };

    // atualizarAlunos([...alunos, aluno]);
    // setNovoAluno(alunoVazio);
    setFormularioAberto(false);
  }

  const { data: turmas = [], isLoading } = useQuery<Turma[]>({
    queryKey: ["classrooms"],
    queryFn: async () => {
      return await getClassrooms();
    },
  });

  const { data: alunos = [] } = useQuery<Aluno[]>({
    queryKey: ["students"],
    queryFn: async () => {
      return await getStudents();
    },
  });

  const lista = useMemo(
    () =>
      alunos
        .map((a) => ({ ...a }))
        .filter((a) => {
          const q = pesquisa.trim().toLowerCase();
          const okQ = !q || a.nome.toLowerCase().includes(q) || a.numero.includes(q);
          const okT = turma === "Todas" || a.turma === turma;
          const okE =
            filtroEstado === "Todos" ||
            estado(a.media ?? 0, maxNotaDaTurma(a.turma)) === filtroEstado;
          return okQ && okT && okE;
        }),
    [alunos, pesquisa, turma, filtroEstado],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Alunos"
       
      />

      <section className="px-4 sm:px-8">
        <div className="glass overflow-hidden rounded-xl border border-white/5">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
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
              {["Todos", "Aprovado", "Reprovado"].map((s) => (
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
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mut">
                  <th scope="col" className="px-5 py-3 text-left font-medium">Nº</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Nome</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Turma</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Encarregado</th>
                  <th scope="col" className="px-5 py-3 text-center font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {lista.map((a) => (
                  <tr
                    key={a.numero}
                    className="border-b border-line/60 last:border-0 hover:bg-surface/60"
                  >
                    <td className="px-5 py-3">{a.numero}</td>
                    <td className="px-4 py-3 text-foreground">{a.nome}</td>
                    <td className="px-4 py-3">{a.turma}</td>
                    <td className="px-4 py-3">{a.encarregado}</td>
                    <td className="px-5 py-3 text-center">
                      <EstadoBadge estado={estado(a.media ?? 0, maxNotaDaTurma(a.turma))} />
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
