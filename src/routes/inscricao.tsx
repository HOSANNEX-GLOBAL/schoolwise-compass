import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery } from "@tanstack/react-query";
import { getSchoolLevels } from "@/api/schoollevel";
import { SchoolLevel } from "@/types/schoollevel.ds";
import { getRegistrations } from "@/api/registration";
import { Registration } from "@/types/registration.ds";

const STORAGE_KEY = "schoolwise:inscricoes:v1";
const MATRICULAS_STORAGE_KEY = "schoolwise:matriculas:v1";
const inscricaoVazia = {
  nome: "",
  bi: "",
  endereco: "",
  dataNascimento: "",
  classe: "",
  encarregado: "",
  contacto: "",
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
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaInscricao, setNovaInscricao] = useState(inscricaoVazia);
  const [mensagem, setMensagem] = useState("");

  const { data: inscricoesApi = [] } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: getRegistrations,
  });
  const [inscricoes, setInscricoes] = useState<Registration[]>([]);

  useEffect(() => {
    const locais = window.localStorage.getItem(STORAGE_KEY);
    setInscricoes([...(locais ? (JSON.parse(locais) as Registration[]) : []), ...inscricoesApi]);
  }, [inscricoesApi]);

  function adicionarInscricao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inscricao: Registration = {
      id: Date.now(),
      bi: novaInscricao.bi.trim(),
      candidato: novaInscricao.nome.trim(),
      dataNascimento: novaInscricao.dataNascimento,
      classePretendida: novaInscricao.classe,
      encarregado: novaInscricao.encarregado.trim(),
      contacto: novaInscricao.contacto.trim(),
      endereco: novaInscricao.endereco.trim(),
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
                  <th className="text-left font-medium py-2.5 pe-5">Classe pretendida</th>
                  <th className="text-left font-medium py-2.5 pe-5">Encarregado</th>
                  <th className="text-left font-medium py-2.5">Contacto</th>
                  <th className="text-right font-medium py-2.5 pr-5">Estado</th>
                  <th className="text-right font-medium py-2.5 pr-5">Decisão</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {inscricoes.map((inscricao) => (
                  <tr
                    key={inscricao.id}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-5 text-foreground">{inscricao.candidato}</td>
                    <td className="py-2.5">{inscricao.classePretendida}</td>
                    <td className="py-2.5">{inscricao.encarregado}</td>
                    <td className="py-2.5">{inscricao.contacto}</td>
                    <td className="py-2.5 text-right text-warn">{inscricao.estado}</td>
                    <td className="py-2.5 pr-5 text-right">

                      {/* Abaixo esta o botão de aprovação da inscrição */}
                      {inscricao.estado === "Pendente" && (
                        <span className="inline-flex gap-2">
                          <button
                            type="button"
                            title="Aprovar inscrição"
                            aria-label={`Aprovar ${inscricao.candidato}`}
                            className="rounded-md p-1.5  text-pass ring-2 ring-pass/40 hover:bg-pass/10"
                          >
                            <Check size={15} />
                          </button>
                          {/* Abaixo esta o botão de recusação da inscrição */}
                          <button
                            type="button"
                            title="Recusar inscrição"
                            aria-label={`Recusar ${inscricao.candidato}`}
                            className="rounded-md p-1.5 text-warn ring-2 ring-warn/40 hover:bg-warn/10"
                          >
                            <X size={15} />
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {inscricoes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-mut">
                      Nenhuma inscrição registada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {mensagem && (
        <p className="mx-8 mt-4 rounded-md border border-pass/30 bg-pass/10 px-4 py-3 text-sm text-pass">
          {mensagem}
        </p>
      )}

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
  const { data: niveis = [] } = useQuery<SchoolLevel[]>({
    queryKey: ["school-levels"],
    queryFn: async () => {
      return await getSchoolLevels();
    },
  });

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
              value={valor.bi}
              onChange={(event) => onChange({ ...valor, bi: event.target.value })}
              placeholder="BI / Cédula"
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              required
              value={valor.endereco}
              onChange={(event) => onChange({ ...valor, endereco: event.target.value })}
              placeholder="Endereço"
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="date"
              value={valor.dataNascimento}
              onChange={(event) => onChange({ ...valor, dataNascimento: event.target.value })}
              placeholder="Data de nascimento"
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <select
              value={valor.classe}
              onChange={(event) =>
                onChange({ ...valor, classe: event.target.value as typeof valor.classe })
              }
              className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            >
              {niveis.map((nivel) => (
                <option key={nivel.id}>{nivel.nome}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
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
