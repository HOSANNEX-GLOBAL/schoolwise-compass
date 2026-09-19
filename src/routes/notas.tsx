import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { EstadoBadge } from "@/components/EstadoBadge";
import { isTeacherAuthorizedFor, readSession } from "@/lib/auth";
import {
  alunos as alunosIniciais,
  disciplinas as disciplinasIniciais,
  estado,
  fmt,
  maxNotaDaTurma,
  media,
  normalizarNotas,
  turmas as turmasIniciais,
  type Aluno,
  type Alteracao,
  type Disciplina,
  type Turma,
} from "@/lib/school-data";

const ALUNOS_STORAGE_KEY = "schoolwise:alunos:v1";
const DISCIPLINAS_STORAGE_KEY = "schoolwise:disciplinas:v1";
const TURMAS_STORAGE_KEY = "schoolwise:turmas:v2";
const HISTORICO_STORAGE_KEY = "schoolwise:historico-notas:v1";

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
      {
        property: "og:description",
        content: "Notas por trimestre, médias automáticas e recursos.",
      },
    ],
  }),
  component: NotasPage,
});

type Linha = { numero: string; nome: string; turma: string; t1: string; t2: string; t3: string };

function NotasPage() {
  const usuario = readSession();
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [turmas, setTurmas] = useState<Turma[]>(turmasIniciais);
  const [disciplina, setDisciplina] = useState(disciplinasIniciais[0]!.nome);
  const [turma, setTurma] = useState(turmasIniciais[0]!.nome);
  const [historico, setHistorico] = useState<Alteracao[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    alunosIniciais.map((a) => ({
      numero: a.numero,
      nome: a.nome,
      turma: a.turma,
      t1: String(a.notas.t1),
      t2: String(a.notas.t2),
      t3: String(a.notas.t3),
    })),
  );

  const disciplinasPermitidas =
    usuario?.cargo === "professor"
      ? disciplinasIniciais.filter(
          (d) => d.professor === usuario.nome || d.nome === usuario.disciplina,
        )
      : disciplinasIniciais;
  const turmasPermitidas =
    usuario?.cargo === "professor"
      ? turmasIniciais.filter((t) => usuario.turmas?.includes(t.nome))
      : turmasIniciais;

  useEffect(() => {
    const guardados = window.localStorage.getItem(ALUNOS_STORAGE_KEY);
    if (guardados) {
      const lista = JSON.parse(guardados) as Aluno[];
      const normalizados = lista.map((aluno) => ({
        ...aluno,
        notas: normalizarNotas(aluno.notas, aluno.turma),
      }));
      setAlunos(normalizados);
      setLinhas(
        normalizados.map((a) => ({
          numero: a.numero,
          nome: a.nome,
          turma: a.turma,
          t1: String(a.notas.t1),
          t2: String(a.notas.t2),
          t3: String(a.notas.t3),
        })),
      );
    }
    const disciplinasGuardadas = window.localStorage.getItem(DISCIPLINAS_STORAGE_KEY);
    if (disciplinasGuardadas) setDisciplinas(JSON.parse(disciplinasGuardadas) as Disciplina[]);
    const turmasGuardadas = window.localStorage.getItem(TURMAS_STORAGE_KEY);
    if (turmasGuardadas) setTurmas(JSON.parse(turmasGuardadas) as Turma[]);
    const historicoGuardado = window.localStorage.getItem(HISTORICO_STORAGE_KEY);
    if (historicoGuardado) setHistorico(JSON.parse(historicoGuardado) as Alteracao[]);
  }, []);

  useEffect(() => {
    if (usuario?.cargo === "professor") {
      const disciplinaValida = disciplinasPermitidas.some((d) => d.nome === disciplina);
      const turmaValida = turmasPermitidas.some((t) => t.nome === turma);

      if (!disciplinaValida || !turmaValida) {
        const proximaDisciplina = disciplinasPermitidas[0]?.nome ?? disciplina;
        const proximaTurma = turmasPermitidas[0]?.nome ?? turma;
        setDisciplina(proximaDisciplina);
        setTurma(proximaTurma);
      }
    }
  }, [usuario, disciplina, turma, disciplinasPermitidas, turmasPermitidas]);

  function gravarLancamento() {
    if (!isTeacherAuthorizedFor(usuario, disciplina, turma)) {
      toast.error("Acesso bloqueado", {
        description: "O professor não está autorizado para lançar notas nesta disciplina/turma.",
      });
      return;
    }

    let alteracoes = 0;
    const atualizados = alunos.map((aluno) => {
      const linha = linhas.find((item) => item.numero === aluno.numero);
      if (!linha) return aluno;
      const notas = {
        t1: Number(linha.t1) || 0,
        t2: Number(linha.t2) || 0,
        t3: Number(linha.t3) || 0,
      };
      if (
        aluno.notas.t1 !== notas.t1 ||
        aluno.notas.t2 !== notas.t2 ||
        aluno.notas.t3 !== notas.t3
      ) {
        alteracoes += 1;
      }
      return {
        ...aluno,
        notas,
      };
    });

    if (alteracoes === 0) {
      toast.info("Nenhuma alteração detetada", {
        description: "Altere pelo menos uma nota antes de gravar.",
      });
      return;
    }

    const entrada: Alteracao = {
      data: new Date().toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      utilizador: usuario?.nome ?? "Utilizador do sistema",
      descricao: `${alteracoes} nota(s) alterada(s) · ${disciplina} · ${turma}`,
    };
    const historicoAtualizado = [entrada, ...historico].slice(0, 20);

    setAlunos(atualizados);
    setHistorico(historicoAtualizado);
    window.localStorage.setItem(ALUNOS_STORAGE_KEY, JSON.stringify(atualizados));
    window.localStorage.setItem(HISTORICO_STORAGE_KEY, JSON.stringify(historicoAtualizado));
    toast.success("Lançamento gravado", { description: `${disciplina} · ${turma}` });
  }

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
    if (
      valor !== "" &&
      Number(valor) > maxNotaDaTurma(linhas.find((l) => l.numero === numero)?.turma ?? turma)
    )
      return;
    setLinhas((prev) => prev.map((l) => (l.numero === numero ? { ...l, [campo]: valor } : l)));
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliações"
        title="Lançamento e gestão de notas"
        action={
          <button
            type="button"
            onClick={gravarLancamento}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
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
                onChange={(e) => {
                  const proxima = e.target.value;
                  if (
                    usuario?.cargo === "professor" &&
                    !isTeacherAuthorizedFor(usuario, disciplina, proxima)
                  ) {
                    toast.error("Turma não autorizada", {
                      description: "Esta turma não corresponde à sua atribuição docente.",
                    });
                    return;
                  }
                  setTurma(proxima);
                }}
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                {(usuario?.cargo === "professor" ? turmasPermitidas : turmas).map((t) => (
                  <option key={t.nome} className="bg-ink2">
                    {t.nome}
                  </option>
                ))}
              </select>
              <select
                value={disciplina}
                onChange={(e) => {
                  const proxima = e.target.value;
                  if (
                    usuario?.cargo === "professor" &&
                    !isTeacherAuthorizedFor(usuario, proxima, turma)
                  ) {
                    toast.error("Disciplina não autorizada", {
                      description: "Esta disciplina não corresponde à sua atribuição docente.",
                    });
                    return;
                  }
                  setDisciplina(proxima);
                }}
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                {(usuario?.cargo === "professor" ? disciplinasPermitidas : disciplinas).map((d) => (
                  <option key={d.codigo} className="bg-ink2">
                    {d.nome}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-mut">Média automática</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-155 text-sm">
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
                  const maxNota = maxNotaDaTurma(l.turma);
                  const e = estado(m, maxNota);
                  return (
                    <tr key={l.numero} className="border-b border-line/60 last:border-0">
                      <td className="py-2 text-foreground">{l.nome}</td>
                      {(["t1", "t2", "t3"] as const).map((c) => (
                        <td key={c} className="py-2 text-center">
                          <input
                            inputMode="numeric"
                            aria-label={`${c.toUpperCase()} de ${l.nome}`}
                            max={maxNota}
                            value={l[c]}
                            onChange={(ev) => set(l.numero, c, ev.target.value)}
                            className="w-12 text-center bg-surface ring-1 ring-white/10 rounded-md py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                          />
                        </td>
                      ))}
                      <td className="py-2 text-center">
                        <span
                          className={`font-semibold ${
                            e === "Aprovado"
                              ? "text-pass"
                              : e === "Recurso"
                                ? "text-warn"
                                : "text-fail"
                          }`}
                        >
                          {fmt(m)} /{maxNota}
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
            Média da grelha: <span className="text-foreground font-medium">{fmt(mediaGrelha)}</span>{" "}
            · aprovação a partir de 6/10 ou 11/20
          </p>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <div className="glass clip p-5">
            <h2 className="text-sm font-semibold mb-1">Gestão de recursos</h2>
            <p className="text-[11px] text-mut mb-3">Alunos em exame de recurso nesta grelha.</p>
            <div className="space-y-2">
              {linhas
                .filter((l) => estado(calc(l), maxNotaDaTurma(l.turma)) !== "Aprovado")
                .map((l) => (
                  <div key={l.numero} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{l.nome}</span>
                    <span className="text-mut">{fmt(calc(l))}</span>
                  </div>
                ))}
              {linhas.every((l) => estado(calc(l), maxNotaDaTurma(l.turma)) === "Aprovado") && (
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
