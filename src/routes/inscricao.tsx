import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchoolLevels } from "@/api/schoollevel";
import { SchoolLevel } from "@/types/schoollevel.ds";
import { getRegistrations, postRegistrations, putRegistrations, updateRegistrationStatus } from "@/api/registration";
import { Registration, RegistrationForm, RegistrationStatus } from "@/types/registration.ds";

export type InscricaoForm = {
  id: number | null;
  nome: string;
  bi: string;
  endereco: string;
  dataNascimento: string;
  genero: string;
  encarregado: string;
  contacto: string;
  classe: string;
};

export const inscricaoVazia: InscricaoForm = {
  id: null,
  nome: "",
  bi: "",
  endereco: "",
  dataNascimento: "",
  genero: "",
  encarregado: "",
  contacto: "",
  classe: "",
};

function formatarData(data: string) {
  if (!data) return "—";
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

function formatarEstado(estado: Registration["estado"]) {
  switch ((estado ?? "pending").toLowerCase()) {
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
      return estado ?? "Pendente";
  }
}

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
  const queryClient = useQueryClient();
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaInscricao, setNovaInscricao] = useState<InscricaoForm>(inscricaoVazia);
  const [edicaoAberta, setEdicaoAberta] = useState(false);

  const { data: inscricoes = [] } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: getRegistrations,
  });

  async function adicionarInscricao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inscricao: RegistrationForm = {
      id: novaInscricao.id,
      name: novaInscricao.nome.trim(),
      bi: novaInscricao.bi.trim(),
      date_of_birth: novaInscricao.dataNascimento,
      genus: novaInscricao.genero.trim(),
      guardian: novaInscricao.encarregado.trim(),
      guardian_phone: novaInscricao.contacto.trim(),
      address: novaInscricao.endereco.trim(),
      school_level_id: Number(novaInscricao.classe),
    };

    
    if (edicaoAberta) {
      await putRegistrations(inscricao);
    } else {
      const { id: _id, ...dadosInscricao } = inscricao;
      await postRegistrations(dadosInscricao);
    }

    await queryClient.invalidateQueries({ queryKey: ["registrations"] });
    setNovaInscricao(inscricaoVazia);
    setEdicaoAberta(false);
    setFormularioAberto(false);
  }

  function abrirEdicao(inscricao: Registration) {
    setNovaInscricao({
      id: inscricao.id,
      nome: inscricao.candidato,
      bi: inscricao.bi,
      endereco: inscricao.endereco,
      dataNascimento: inscricao.dataNascimento.slice(0, 10),
      genero: inscricao.genero,
      encarregado: inscricao.encarregado,
      contacto: inscricao.contacto,
      classe: String(inscricao.classId),
    });
    setEdicaoAberta(true);
    setFormularioAberto(true);
  }

  async function alterarEstado(id: number, status: number) {
    await updateRegistrationStatus({ id, status });
    await queryClient.invalidateQueries({ queryKey: ["registrations"] });
  }

  function fecharFormulario() {
    setFormularioAberto(false);
    setEdicaoAberta(false);
    setNovaInscricao(inscricaoVazia);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admissões"
        title="Inscrições"
        action={
          <button
            type="button"
            onClick={() => {
              setEdicaoAberta(false);
              setNovaInscricao(inscricaoVazia);
              setFormularioAberto(true);
            }}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova inscrição
          </button>
        }
      />

      <section className="px-4 sm:px-8">
        <div className="glass overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold">Candidaturas registadas</h2>
            <span className="text-[11px] text-mut">{inscricoes.length} inscrições</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1460px] text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mut">
                  <th scope="col" className="px-5 py-3 text-left font-medium">Candidato</th>
                  <th scope="col" className="px-4 py-3 text-center font-medium">BI</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Data de Nascimento</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Gênero</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Classe pretendida</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Encarregado</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Contacto</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Endereço</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Estado</th>
                  <th scope="col" className="px-5 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {inscricoes.map((inscricao) => {
                  const estado = formatarEstado(inscricao.estado);
                  return (
                    <tr
                      key={inscricao.id}
                      className="border-b border-line/60 last:border-0 hover:bg-surface/60"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">{inscricao.candidato}</td>
                      <td className="whitespace-nowrap px-4 py-3">{inscricao.bi}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatarData(inscricao.dataNascimento)}</td>
                      <td className="px-4 py-3">{inscricao.genero}</td>
                      <td className="px-4 py-3">{inscricao.classePretendida}</td>
                      <td className="px-4 py-3">{inscricao.encarregado}</td>
                      <td className="whitespace-nowrap px-4 py-3">{inscricao.contacto}</td>
                      <td className="max-w-48 truncate px-4 py-3" title={inscricao.endereco}>
                        {inscricao.endereco || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{estado}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(inscricao)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void alterarEstado(inscricao.id, RegistrationStatus.APPROVED)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-pass hover:bg-pass/10"
                          >
                            Aprovar
                          </button>
                          <button
                            type="button"
                            onClick={() => void alterarEstado(inscricao.id, RegistrationStatus.REJECTED)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-fail hover:bg-fail/10"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {inscricoes.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-mut">
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
        emEdicao={edicaoAberta}
        valor={novaInscricao}
        onChange={setNovaInscricao}
        onClose={fecharFormulario}
        onSubmit={adicionarInscricao}
      />
    </AppShell>
  );
}

function DialogInscricao({
  aberto,
  emEdicao,
  valor,
  onChange,
  onClose,
  onSubmit,
}: {
  aberto: boolean;
  emEdicao: boolean;
  valor: InscricaoForm;
  onChange: (valor: InscricaoForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {

  const { data: niveis = [] } = useQuery<SchoolLevel[]>({
    queryKey: ["school-levels"],
    queryFn: getSchoolLevels,
  });

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inscricao-dialog-title"
        className="glass my-auto w-full max-w-2xl rounded-xl p-6"
      >
        <h2 id="inscricao-dialog-title" className="text-lg font-semibold">
          {emEdicao ? "Editar inscrição" : "Nova inscrição"}
        </h2>
        <p className="mt-1 text-sm text-mut">Registe os dados do candidato para análise da secretaria.</p>
        <form onSubmit={onSubmit} className="mt-5 grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              value={valor.nome}
              onChange={(event) => onChange({ ...valor, nome: event.target.value })}
              placeholder="Nome completo"
              aria-label="Nome completo"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <select
              required
              value={valor.genero}
              onChange={(event) => onChange({ ...valor, genero: event.target.value })}
              aria-label="Género"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            >
              <option value="">Selecione o género</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            <input
              required
              value={valor.bi}
              onChange={(event) => onChange({ ...valor, bi: event.target.value })}
              placeholder="BI / Cédula"
              aria-label="BI ou cédula"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              required
              type="date"
              value={valor.dataNascimento}
              onChange={(event) => onChange({ ...valor, dataNascimento: event.target.value })}
              aria-label="Data de nascimento"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <select
              required
              value={valor.classe}
              onChange={(event) => onChange({ ...valor, classe: event.target.value })}
              aria-label="Classe pretendida"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            >
              <option value="">Selecione a classe pretendida</option>
              {niveis.map((nivel) => (
                <option key={nivel.id} value={nivel.id}>{nivel.nome}</option>
              ))}
            </select>
            <input
              required
              value={valor.endereco}
              onChange={(event) => onChange({ ...valor, endereco: event.target.value })}
              placeholder="Endereço"
              aria-label="Endereço"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              required
              value={valor.encarregado}
              onChange={(event) => onChange({ ...valor, encarregado: event.target.value })}
              placeholder="Nome do encarregado"
              aria-label="Nome do encarregado"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
            <input
              required
              type="tel"
              value={valor.contacto}
              onChange={(event) => onChange({ ...valor, contacto: event.target.value })}
              placeholder="Contacto do encarregado"
              aria-label="Contacto do encarregado"
              className="w-full rounded-md bg-surface px-3 py-2 text-sm ring-1 ring-white/10"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
            >
              {emEdicao ? "Guardar alterações" : "Guardar inscrição"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
