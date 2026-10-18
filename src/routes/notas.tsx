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
  normalizarNotas,
  type Aluno,
  type Alteracao,
  type Disciplina,
  anoLetivo,
} from "@/lib/school-data";
import { getSchoolLevels } from "@/api/schoollevel";
import { SchoolLevel } from "@/types/schoollevel.ds";
import { useQuery } from "@tanstack/react-query";
import { getClassrooms } from "@/api/classrooms";
import type { Turma as TurmaAPI } from "@/types/classroom.ds";

const ALUNOS_STORAGE_KEY = "schoolwise:alunos:v1";
const DISCIPLINAS_STORAGE_KEY = "schoolwise:disciplinas:v1";
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

type Linha = { numero: string; nome: string; turma: string; MAC: string; PP: string; PT: string };

function NotasPage() {
  const usuario = readSession();
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [disciplina, setDisciplina] = useState(disciplinasIniciais[0]!.nome);
  const [turma, setTurma] = useState("");
  const [nivelAcademicoId, setNivelAcademicoId] = useState("");
  const [historico, setHistorico] = useState<Alteracao[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    alunosIniciais.map((a) => ({
      numero: a.numero,
      nome: a.nome,
      turma: a.turma,
      MAC: String(a.notas.MAC),
      PP: String(a.notas.PP),
      PT: String(a.notas.PT),
    })),
  );

  const {
    data: turmasAPI = [],
    isLoading: turmasLoading,
    isError: turmasError,
    error: erroTurmas,
  } = useQuery<TurmaAPI[]>({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  });

  const disciplinasPermitidas =
    usuario?.cargo === "professor"
      ? disciplinasIniciais.filter(
          (d) => d.professor === usuario.nome || d.nome === usuario.disciplina,
        )
      : disciplinasIniciais;
  const turmasPermitidas =
    usuario?.cargo === "professor"
      ? turmasAPI.filter((t) => usuario.turmas?.includes(t.nome))
      : turmasAPI;

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
          MAC: String(a.notas.MAC),
          PP: String(a.notas.PP),
          PT: String(a.notas.PT),
        })),
      );
    }

    

    const disciplinasGuardadas = window.localStorage.getItem(DISCIPLINAS_STORAGE_KEY);
    if (disciplinasGuardadas) setDisciplinas(JSON.parse(disciplinasGuardadas) as Disciplina[]);
    const historicoGuardado = window.localStorage.getItem(HISTORICO_STORAGE_KEY);
    if (historicoGuardado) setHistorico(JSON.parse(historicoGuardado) as Alteracao[]);
  }, []);

  useEffect(() => {
    if (!turmasPermitidas.some((item) => item.nome === turma)) {
      setTurma(turmasPermitidas[0]?.nome ?? "");
    }
  }, [turmasAPI, usuario?.cargo, usuario?.turmas, turma]);

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
        MAC: Number(linha.MAC) || 0,
        PP: Number(linha.PP) || 0,
        PT: Number(linha.PT) || 0,
      };
      if (
        aluno.notas.MAC !== notas.MAC ||
        aluno.notas.PP !== notas.PP ||
        aluno.notas.PT !== notas.PT
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
    const vals = [l.MAC, l.PP, l.PT].map((v) => Number(v)).filter((v) => !Number.isNaN(v) && v > 0);
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
  };

  const mediaGrelha = useMemo(() => {
    const ms = linhas.map(calc);
    return ms.reduce((s, m) => s + m, 0) / ms.length;
  }, [linhas]);

  const set = (numero: string, campo: "MAC" | "PP" | "PT", valor: string) => {
    if (valor !== "" && !/^\d{0,2}$/.test(valor)) return;
    if (
      valor !== "" &&
      Number(valor) > maxNotaDaTurma(linhas.find((l) => l.numero === numero)?.turma ?? turma)
    )
      return;
    setLinhas((prev) => prev.map((l) => (l.numero === numero ? { ...l, [campo]: valor } : l)));
  };

  
  const {
    data: niveis = [],
    isLoading: niveisLoading,
    isError: niveisError,
    error: erroNiveis,
  } = useQuery<SchoolLevel[]>({
    queryKey: ["school-levels"],
    queryFn: getSchoolLevels,
  });
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

      <section className="px-8 grid grid-cols-1 xl:grid-cols-12 gap-4 ">
        <div className="xl:col-span-8 glass rounded-xl p-5 w-full min-w-[1200px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-semibold">Grelha de notas - {anoLetivo} </h2>
            <div className="flex flex-wrap items-center gap-2">
                   <select
              
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                  <option value="Selecione o Trimestre"  className="bg-ink2">
                    Selecione o Trimestre                  
                    </option>
                  <option value="Iº Trimestre" className="bg-ink2">
                    Iº Trimestre
                  </option>
                </select>
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
              aria-label="Turma"
              disabled={turmasLoading || turmasError || turmasPermitidas.length === 0}
              className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="" className="bg-ink2">
                {turmasLoading
                  ? "A carregar turmas..."
                  : turmasError
                    ? "Erro ao carregar turmas"
                    : turmasPermitidas.length === 0
                      ? "Sem turmas disponíveis"
                      : "Selecione a turma"}
              </option>
              {turmasPermitidas.map((t) => (
                <option key={t.id} className="bg-ink2" value={t.nome}>
                  {t.nome}
                </option>
              ))}
            </select>
                {turmasError && (
                  <p className="text-xs text-red-400" role="alert">
                    Não foi possível carregar as turmas.
                    {erroTurmas instanceof Error ? ` ${erroTurmas.message}` : ""}
                  </p>
                )}
                <select
                  value={nivelAcademicoId}
                  onChange={(event) => setNivelAcademicoId(event.target.value)}
                  aria-label="Nível académico"
                  disabled={niveisLoading || niveisError || niveis.length === 0}
                  className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none disabled:opacity-50"
                >
                  <option value="">
                    {niveisLoading
                      ? "A carregar níveis..."
                      : niveisError
                        ? "Erro ao carregar níveis"
                        : niveis.length === 0
                          ? "Sem níveis disponíveis"
                          : "Selecione a classe"}
                  </option>
                  {niveis.map((nivel) => (
                    <option key={nivel.id} value={nivel.id} className="bg-ink2">
                      {nivel.nome}
                    </option>
                  ))}
                </select>
                              
              {/* <select
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
              </select> */}
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

                 <select
              
                className="bg-surface ring-1 ring-white/10 rounded-md px-3 py-1.5 text-xs focus:outline-none"
              >
                  <option value="Selecione o ano lectivo"  className="bg-ink2">
                    Selecione o ano lectivo
                  </option>
                  <option value={anoLetivo} className="bg-ink2">
                    {anoLetivo}
                  </option>
                </select>
                
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mut">
                  <th scope="col" className="px-5 py-3 text-left font-medium">Aluno</th>
                  <th scope="col" className="px-3 py-3 text-center font-medium">MAC</th>
                  <th scope="col" className="px-3 py-3 text-center font-medium">PP</th>
                  <th scope="col" className="px-3 py-3 text-center font-medium">PT</th>
                  <th scope="col" className="px-3 py-3 text-center font-medium">Média</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {linhas.map((l) => {
                  const m = calc(l);
                  const maxNota = maxNotaDaTurma(l.turma);
                  const e = estado(m, maxNota);
                  return (
                    <tr key={l.numero} className="border-b border-line/60 last:border-0 hover:bg-surface/60">
                      <td className="px-5 text-foreground">{l.nome}</td>
                      {(["MAC", "PP", "PT"] as const).map((c) => (
                        <td key={c} className="px-3 text-center">
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
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            e === "Aprovado"
                              ? "text-pass"
                              : e === "Reprovado"
                                ? "text-fail"
                                : "text-warn"
                          }`}
                        >
                          {fmt(m)} /{maxNota}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
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

        {/* <div className="xl:col-span-4 space-y-4">
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
        </div> */}
      </section>
    </AppShell>
  );
}
