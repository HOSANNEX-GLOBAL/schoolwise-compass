import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Enrollment, EnrollmentStatus } from "@/types/enrollment.ds";
import { getEnrollments, updateEnrollmentStatus } from "@/api/enrollment";



function formatarEstado(estado: Enrollment["status"] | number | string | null | undefined) {
  const valor = String(estado ?? "pending").toLowerCase();

  switch (valor) {
    case "0":
    case "pending":
      return "Pendente";
    case "1":
    case "approved":
      return "Aprovada";
    case "2":
    case "rejected":
      return "Rejeitada";
    default:
      return "Pendente";
  }
}

function formatarData(data?: Date | string | null) {
  if (!data) return "—";

  const dataObj = data instanceof Date ? data : new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return "—";
  }

  return dataObj.toLocaleDateString("pt-PT");
}

export const Route = createFileRoute("/matricula")({
  head: () => ({
    meta: [
      { title: "Matrículas — Gestão Académica" },
      { name: "description", content: "Registo e acompanhamento de matrículas escolares." },
    ],
  }),
  component: MatriculaPage,
});
function MatriculaPage() {
  const queryClient = useQueryClient();
  const { data: matriculas = [] } = useQuery<Enrollment[]>({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
  });



  // function gerarNumeroProcesso(alunos: Aluno[]) {
  //   const ano = anoLetivo.slice(0, 4);
  //   const maior = alunos.reduce((maiorSequencial, aluno) => {
  //     const [anoDoAluno, sequencial] = aluno.numero.split("-");
  //     return anoDoAluno === ano
  //       ? Math.max(maiorSequencial, Number(sequencial) || 0)
  //       : maiorSequencial;
  //   }, 0);
  //   return `${ano}-${String(maior + 1).padStart(4, "0")}`;
  // }

  // function adicionarMatricula(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const dadosGuardados = window.localStorage.getItem(ALUNOS_STORAGE_KEY);
  //   const alunos = dadosGuardados ? (JSON.parse(dadosGuardados) as Aluno[]) : [];
  //   const numeroProcesso = gerarNumeroProcesso(alunos);
  //   const turma = `${novaMatricula.classe} ${novaMatricula.turma.toUpperCase()}`;
  //   const novoAluno: any = {
  //     numero: numeroProcesso,
  //     nome: novaMatricula.nome.trim(),
  //     turma,
  //     encarregado: novaMatricula.encarregado.trim(),
  //     dataNascimento: novaMatricula.dataNascimento,
  //     contactoEncarregado: novaMatricula.contactoEncarregado.trim(),
  //     estadoMatricula: "Ativo",
  //     // notas: { t1: 0, t2: 0, t3: 0 },
  //   };
  //   const alunosAtualizados = [...alunos, novoAluno];
  //   const matricula: Matricula = {
  //     id: crypto.randomUUID(),
  //     numeroProcesso,
  //     nome: novoAluno.nome,
  //     turma,
  //     data: new Date().toLocaleDateString("pt-PT"),
  //     estado: "Ativa",
  //   };
  //   const lista = [matricula, ...matriculas];
  //   window.localStorage.setItem(ALUNOS_STORAGE_KEY, JSON.stringify(alunosAtualizados));
  //   window.localStorage.setItem(MATRICULAS_STORAGE_KEY, JSON.stringify(lista));
  //   setMatriculas(lista);
  //   setNovaMatricula(matriculaVazia);
  //   setFormularioAberto(false);
  // }

  async function alterarEstado(id: number, status: number) {
    await updateEnrollmentStatus({ id, status });
    await queryClient.invalidateQueries({ queryKey: ["enrollments"] });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admissões"
        title="Matrículas"
      />

      <section className="px-4 sm:px-8">
        <div className="glass overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold">Matrículas registadas</h2>
            <span className="text-[11px] text-mut">{matriculas.length} matrículas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1460px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mut">
                  <th scope="col" className="px-5 py-3 text-left font-medium">
                    Processo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    Aluno
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-medium">BI</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Dat. matrícula</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Endereço</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Encarregado</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Contacto</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Classe pretendida</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium px-5">Ano lectivo</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Estado</th>
                  <th scope="col" className="px-5 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>

              <tbody className="text-mut">
                {matriculas.map((matricula) => {
                  const estado = formatarEstado(matricula.status);

                  return (
                    <tr
                      key={matricula.id}
                      className="border-b border-line/60 last:border-0 hover:bg-surface/60"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">{matricula.studentNumber}</td>
                      <td className="whitespace-nowrap px-4 py-3">{matricula.studentName}</td>
                      <td className="whitespace-nowrap px-4 py-3">{matricula.bi}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatarData(matricula.createdAt)}</td>
                      <td className="max-w-56 truncate px-4 py-3" title={matricula.address}>
                        {matricula.address || "—"}
                      </td>
                      <td className="px-4 py-3">{matricula.guardian}</td>
                      <td className="whitespace-nowrap px-4 py-3">{matricula.guardianPhone || "—"}</td>
                      <td className="px-4 py-3">{matricula.schoolLevelName}</td>
                      <td className="px-4 py-3">{matricula.academicYearName}</td>
                      <td className="whitespace-nowrap px-4 py-3">{estado}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => void alterarEstado(matricula.id, EnrollmentStatus.APPROVED)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-pass hover:bg-pass/10"
                          >
                            Aprovar
                          </button>
                          <button
                            type="button"
                            onClick={() => void alterarEstado(matricula.id, EnrollmentStatus.REJECTED)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-fail hover:bg-fail/10"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {matriculas.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-mut">
                      Nenhuma matrícula registada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* {formularioAberto && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
          <div className="glass w-full max-w-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold">Nova matrícula</h2>
            <p className="text-sm text-mut mt-1">
              O número de processo será criado automaticamente.
            </p>
            <form onSubmit={adicionarMatricula} className="grid gap-4 mt-5">
              <input
                required
                value={novaMatricula.nome}
                onChange={(event) =>
                  setNovaMatricula({ ...novaMatricula, nome: event.target.value })
                }
                placeholder="Nome completo"
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  value={novaMatricula.dataNascimento}
                  onChange={(event) =>
                    setNovaMatricula({ ...novaMatricula, dataNascimento: event.target.value })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
                <select
                  value={novaMatricula.classe}
                  onChange={(event) =>
                    setNovaMatricula({
                      ...novaMatricula,
                      classe: event.target.value as typeof novaMatricula.classe,
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                >
                  {classesEnsinoGeral.map((classe) => (
                    <option key={classe}>{classe}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={novaMatricula.turma}
                  onChange={(event) =>
                    setNovaMatricula({ ...novaMatricula, turma: event.target.value })
                  }
                  placeholder="Turma (A, B...)"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
                <input
                  required
                  type="tel"
                  value={novaMatricula.contactoEncarregado}
                  onChange={(event) =>
                    setNovaMatricula({ ...novaMatricula, contactoEncarregado: event.target.value })
                  }
                  placeholder="Contacto"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>
              <input
                required
                value={novaMatricula.encarregado}
                onChange={(event) =>
                  setNovaMatricula({ ...novaMatricula, encarregado: event.target.value })
                }
                placeholder="Nome do encarregado"
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
              />
              <div className="flex justify-end gap-2">
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
                  Guardar matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </AppShell>
  );
}
