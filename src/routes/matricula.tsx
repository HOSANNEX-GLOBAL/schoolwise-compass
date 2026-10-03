import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";

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
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);

  useEffect(() => {
    const guardadas = window.localStorage.getItem(MATRICULAS_STORAGE_KEY);
    if (guardadas) {
      setMatriculas((JSON.parse(guardadas) as Partial<Matricula>[]).map(normalizarMatricula));
    }
  }, []);

  return (
    <AppShell>
      <PageHeader eyebrow="Admissões" title="Matrículas" />
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
                  <tr
                    key={matricula.id}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-3 text-brand">{matricula.numeroProcesso}</td>
                    <td className="py-2.5 text-foreground">{matricula.nome}</td>
                    <td className="py-2.5">{matricula.turma}</td>
                    <td className="py-2.5">{matricula.data}</td>
                    <td className="py-2.5 text-pass">{matricula.estado}</td>
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
    </AppShell>
  );
}
