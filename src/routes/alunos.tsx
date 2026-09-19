import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import {
  alunos as alunosIniciais,
  anoLetivo,
  estado,
  fmt,
  maxNotaDaTurma,
  media,
  normalizarNotas,
  turmas,
  type Turma,
  type Aluno,
} from "@/lib/school-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ALUNOS_STORAGE_KEY = "schoolwise:alunos:v1";
const TURMAS_STORAGE_KEY = "schoolwise:turmas:v2";

type NovoAluno = {
  nome: string;
  turma: string;
  encarregado: string;
  dataNascimento: string;
  contactoEncarregado: string;
  estadoMatricula: NonNullable<Aluno["estadoMatricula"]>;
  t1: string;
  t2: string;
  t3: string;
};

const alunoVazio: NovoAluno = {
  nome: "",
  turma: turmas[0]?.nome ?? "",
  encarregado: "",
  dataNascimento: "",
  contactoEncarregado: "",
  estadoMatricula: "Ativo" as const,
  t1: "0",
  t2: "0",
  t3: "0",
};

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
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [turmasAtuais, setTurmasAtuais] = useState<Turma[]>(turmas);
  const [pesquisa, setPesquisa] = useState("");
  const [turma, setTurma] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoAluno, setNovoAluno] = useState(alunoVazio);

  useEffect(() => {
    const dadosGuardados = window.localStorage.getItem(ALUNOS_STORAGE_KEY);

    if (dadosGuardados) {
      const guardados = JSON.parse(dadosGuardados) as Aluno[];
      setAlunos(
        guardados.map((aluno) => ({ ...aluno, notas: normalizarNotas(aluno.notas, aluno.turma) })),
      );
    }
  }, []);

  useEffect(() => {
    const guardadas = window.localStorage.getItem(TURMAS_STORAGE_KEY);
    if (guardadas) setTurmasAtuais(JSON.parse(guardadas) as Turma[]);
  }, []);

  function atualizarAlunos(novosAlunos: Aluno[]) {
    setAlunos(novosAlunos);
    window.localStorage.setItem(ALUNOS_STORAGE_KEY, JSON.stringify(novosAlunos));
  }

  function adicionarAluno(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ano = anoLetivo.slice(0, 4);
    const maiorSequencial = alunos.reduce((maior, aluno) => {
      const [anoDoAluno, sequencial] = aluno.numero.split("-");
      if (anoDoAluno !== ano) return maior;
      return Math.max(maior, Number(sequencial) || 0);
    }, 0);

    const aluno: Aluno = {
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

    atualizarAlunos([...alunos, aluno]);
    setNovoAluno(alunoVazio);
    setFormularioAberto(false);
  }

  const lista = useMemo(
    () =>
      alunos
        .map((a) => ({ ...a, m: media(a.notas) }))
        .filter((a) => {
          const q = pesquisa.trim().toLowerCase();
          const okQ = !q || a.nome.toLowerCase().includes(q) || a.numero.includes(q);
          const okT = turma === "Todas" || a.turma === turma;
          const okE =
            filtroEstado === "Todos" || estado(a.m, maxNotaDaTurma(a.turma)) === filtroEstado;
          return okQ && okT && okE;
        }),
    [alunos, pesquisa, turma, filtroEstado],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Alunos"
        action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
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
              {turmasAtuais.map((t) => (
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
                  <tr
                    key={a.numero}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-5">{a.numero}</td>
                    <td className="py-2.5 text-foreground">{a.nome}</td>
                    <td className="py-2.5">{a.turma}</td>
                    <td className="py-2.5">{a.encarregado}</td>
                    <td className="py-2.5">
                      {fmt(a.m)} /{maxNotaDaTurma(a.turma)}
                    </td>
                    <td className="py-2.5 pr-5 text-right">
                      <EstadoBadge estado={estado(a.m, maxNotaDaTurma(a.turma))} />
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

      <Dialog open={formularioAberto} onOpenChange={setFormularioAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo aluno</DialogTitle>
            <DialogDescription>
              Registe os dados do aluno, do encarregado e as notas disponíveis.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={adicionarAluno} className="grid gap-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label htmlFor="turma-aluno" className="text-sm font-medium">
                  Turma
                </label>
                <select
                  id="turma-aluno"
                  required
                  value={novoAluno.turma}
                  onChange={(event) => setNovoAluno({ ...novoAluno, turma: event.target.value })}
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  {turmasAtuais.map((item) => (
                    <option key={item.nome} value={item.nome}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="nome-aluno" className="text-sm font-medium">
                Nome completo
              </label>
              <input
                id="nome-aluno"
                required
                value={novoAluno.nome}
                onChange={(event) => setNovoAluno({ ...novoAluno, nome: event.target.value })}
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="nascimento-aluno" className="text-sm font-medium">
                  Data de nascimento
                </label>
                <input
                  id="nascimento-aluno"
                  type="date"
                  required
                  value={novoAluno.dataNascimento}
                  onChange={(event) =>
                    setNovoAluno({ ...novoAluno, dataNascimento: event.target.value })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="estado-matricula" className="text-sm font-medium">
                  Estado da matrícula
                </label>
                <select
                  id="estado-matricula"
                  value={novoAluno.estadoMatricula}
                  onChange={(event) =>
                    setNovoAluno({
                      ...novoAluno,
                      estadoMatricula: event.target.value as Aluno["estadoMatricula"],
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option>Ativo</option>
                  <option>Transferido</option>
                  <option>Concluído</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="encarregado-aluno" className="text-sm font-medium">
                  Encarregado
                </label>
                <input
                  id="encarregado-aluno"
                  required
                  value={novoAluno.encarregado}
                  onChange={(event) =>
                    setNovoAluno({ ...novoAluno, encarregado: event.target.value })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="contacto-aluno" className="text-sm font-medium">
                  Contacto do encarregado
                </label>
                <input
                  id="contacto-aluno"
                  type="tel"
                  required
                  value={novoAluno.contactoEncarregado}
                  onChange={(event) =>
                    setNovoAluno({ ...novoAluno, contactoEncarregado: event.target.value })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Ex.: +244 900 000 000"
                />
              </div>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Notas dos trimestres</legend>
              <div className="grid grid-cols-3 gap-3">
                {["t1", "t2", "t3"].map((trimestre) => (
                  <label key={trimestre} className="grid gap-1 text-xs text-mut">
                    {trimestre.toUpperCase()}
                    <input
                      type="number"
                      min="0"
                      max={maxNotaDaTurma(novoAluno.turma)}
                      step="0.1"
                      required
                      value={novoAluno[trimestre as "t1" | "t2" | "t3"]}
                      onChange={(event) =>
                        setNovoAluno({ ...novoAluno, [trimestre]: event.target.value })
                      }
                      className="bg-surface rounded-md px-3 py-2 text-sm text-foreground ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setFormularioAberto(false)}
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                Adicionar aluno
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
