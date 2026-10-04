import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery } from "@tanstack/react-query";
import { Enrollment } from "@/types/enrollment.ds";
import { getEnrollments } from "@/api/enrollment";

const MATRICULAS_STORAGE_KEY = "schoolwise:matriculas:v1";

type Matricula = {
  id: number | string;
  numeroProcesso: string;
  nome: string;
  bi: string | undefined;
  dataNascimento: string | undefined;
  endereco: string | undefined;
  turma: string;
  encarregado: string;
  contactoEncarregado: string | undefined;
  data: string;
  estado: string;
  // pagamento: "Pendente" | "Confirmado";
  // contrato: "Pendente" | "Assinado";
};

export const Route = createFileRoute("/matricula")({
  head: () => ({
    meta: [
      { title: "Matrículas — Gestão Académica" },
      { name: "description", content: "Registo e acompanhamento de matrículas escolares." },
    ],
  }),
  component: MatriculaPage,
});

function normalizarMatricula(item: Partial<Matricula>): Matricula {
  return {
    id: item.id ?? crypto.randomUUID(),
    numeroProcesso: item.numeroProcesso ?? "",
    nome: item.nome ?? "",
    bi: item.bi,
    dataNascimento: item.dataNascimento,
    endereco: item.endereco,
    turma: item.turma ?? "",
    encarregado: item.encarregado ?? "",
    contactoEncarregado: item.contactoEncarregado,
    data: item.data ?? "",
    estado: item.estado ?? "Aprovada",
  };
}

function MatriculaPage() {

    const { data: matriculas = [] } = useQuery<Enrollment[]>({
      queryKey: ["enrollments"],
      queryFn: async () => {
        return await getEnrollments();
      },
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

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admissões"
        title="Matrículas"
        // action={
        //   <button
        //     type="button"
        //     onClick={() => setFormularioAberto(true)}
        //     className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
        //   >
        //     + Nova matrícula
        //   </button>
        // }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="text-sm font-semibold">Matrículas aprovadas</h2>
            <span className="text-[11px] text-mut">{matriculas.length} matrículas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Processo</th>
                  <th className="text-left font-medium py-2.5 px-4">Aluno</th>
                  <th className="text-left font-medium py-2.5">Turma</th>
                  <th className="text-left font-medium py-2.5 px-5">Data</th>
                  <th className="text-left font-medium py-2.5 px-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {matriculas.map((matricula) => (

                  // <td>{matricula.studentNumber}</td>
                  // <td>{matricula.studentName}</td>
                  // <td>{matricula.schoolLevelName}</td>
                  // <td>{matricula.classroomName}</td>
                  // <td>{matricula.academicYearName}</td>
                  // <td>{matricula.status}</td>


                  <tr
                    key={matricula.id}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-3 text-brand">{matricula.studentNumber}</td>
                    <td className="py-2.5 text-foreground">{matricula.studentName}</td>
                    <td className="py-2.5">{matricula.classroomName}</td>
                    <td className="py-2.5">{matricula.academicYearName}</td>
                    <td className="py-2.5 text-pass">{matricula.status}</td>
                  </tr>
                ))}
                {matriculas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-mut">
                      Nenhuma matrícula aprovada pendente.
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
