import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { classesEnsinoGeral } from "@/lib/school-data";

type Inscricao = {
  id: string;
  nome: string;
  dataNascimento: string;
  encarregado: string;
  contacto: string;
  classe: string;
  estado: "Pendente" | "Aprovada" | "Convertida";
};

const STORAGE_KEY = "schoolwise:inscricoes:v1";
const inscricaoVazia = {
  nome: "",
  dataNascimento: "",
  encarregado: "",
  contacto: "",
  classe: classesEnsinoGeral[0],
};

export const Route = createFileRoute("/inscricao")({
  head: () => ({
    meta: [
      { title: "Inscrições — Gestão Académica" },
      { name: "description", content: "Registo e acompanhamento de candidaturas escolares." },
    ],
  }),
  component: InscricaoPage,
});

function InscricaoPage() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaInscricao, setNovaInscricao] = useState(inscricaoVazia);

  useEffect(() => {
    const guardadas = window.localStorage.getItem(STORAGE_KEY);
    if (guardadas) setInscricoes(JSON.parse(guardadas) as Inscricao[]);
  }, []);

  function adicionarInscricao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inscricao: Inscricao = {
      id: crypto.randomUUID(),
      ...novaInscricao,
      estado: "Pendente",
    };
    const lista = [inscricao, ...inscricoes];
    setInscricoes(lista);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    setNovaInscricao(inscricaoVazia);
    setFormularioAberto(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admissões"
        title="Inscrições"
        action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova inscrição
          </button>
        }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="text-sm font-semibold">Candidaturas registadas</h2>
            <span className="text-[11px] text-mut">{inscricoes.length} inscrições</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Candidato</th>
                  <th className="text-left font-medium py-2.5">Classe pretendida</th>
                  <th className="text-left font-medium py-2.5">Encarregado</th>
                  <th className="text-left font-medium py-2.5">Contacto</th>
                  <th className="text-right font-medium py-2.5 pr-5">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {inscricoes.map((inscricao) => (
                  <tr
                    key={inscricao.id}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-5 text-foreground">{inscricao.nome}</td>
                    <td className="py-2.5">{inscricao.classe}</td>
                    <td className="py-2.5">{inscricao.encarregado}</td>
                    <td className="py-2.5">{inscricao.contacto}</td>
                    <td className="py-2.5 pr-5 text-right text-warn">{inscricao.estado}</td>
                  </tr>
                ))}
                {inscricoes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-mut">
                      Nenhuma inscrição registada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DialogInscricao
        aberto={formularioAberto}
        valor={novaInscricao}
        onChange={setNovaInscricao}
        onClose={() => setFormularioAberto(false)}
        onSubmit={adicionarInscricao}
      />
    </AppShell>
  );
}

function DialogInscricao({
  aberto,
  valor,
  onChange,
  onClose,
  onSubmit,
}: {
  aberto: boolean;
  valor: typeof inscricaoVazia;
  onChange: (valor: typeof inscricaoVazia) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      <div className="glass w-full max-w-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold">Nova inscrição</h2>
        <p className="text-sm text-mut mt-1">Registe a candidatura para análise da secretaria.</p>
        <form onSubmit={onSubmit} className="grid gap-4 mt-5">
          <input
            required
            value={valor.nome}
            onChange={(event) => onChange({ ...valor, nome: event.target.value })}
            placeholder="Nome completo"
            className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="date"
              value={valor.dataNascimento}
              onChange={(event) => onChange({ ...valor, dataNascimento: event.target.value })}
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <select
              value={valor.classe}
              onChange={(event) =>
                onChange({ ...valor, classe: event.target.value as typeof valor.classe })
              }
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            >
              {classesEnsinoGeral.map((classe) => (
                <option key={classe}>{classe}</option>
              ))}
            </select>
          </div>
          <input
            required
            value={valor.encarregado}
            onChange={(event) => onChange({ ...valor, encarregado: event.target.value })}
            placeholder="Nome do encarregado"
            className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
          />
          <input
            required
            type="tel"
            value={valor.contacto}
            onChange={(event) => onChange({ ...valor, contacto: event.target.value })}
            placeholder="Contacto do encarregado"
            className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
            >
              Guardar inscrição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
