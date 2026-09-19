import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { getRoleLabel, readSession, readUsers, saveUsers, type SessionUser } from "@/lib/auth";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Utilizadores — Gestão Académica" },
      {
        name: "description",
        content: "Consulte, filtre e administre os utilizadores da plataforma escolar.",
      },
    ],
  }),
  component: UsuariosPage,
});

type FiltroEstado = "Todos" | "Ativos" | "Inativos";

function UsuariosPage() {
  const navigate = useNavigate();
  const [utilizadores, setUtilizadores] = useState<SessionUser[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("Todos");
  const [pesquisa, setPesquisa] = useState("");
  const sessao = readSession();

  useEffect(() => {
    setUtilizadores(readUsers());
  }, []);

  const utilizadoresFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return utilizadores.filter((user) => {
      const correspondeEstado =
        filtroEstado === "Todos" ||
        (filtroEstado === "Ativos" && user.ativo) ||
        (filtroEstado === "Inativos" && !user.ativo);
      const correspondePesquisa =
        !termo ||
        user.nome.toLowerCase().includes(termo) ||
        user.email.toLowerCase().includes(termo) ||
        getRoleLabel(user.cargo).toLowerCase().includes(termo);

      return correspondeEstado && correspondePesquisa;
    });
  }, [filtroEstado, pesquisa, utilizadores]);

  const ativos = utilizadores.filter((user) => user.ativo).length;
  const inativos = utilizadores.length - ativos;

  function atualizarEstado(user: SessionUser) {
    if (user.id === sessao?.id) return;

    const atualizados = utilizadores.map((item) =>
      item.id === user.id ? { ...item, ativo: !item.ativo } : item,
    );
    setUtilizadores(atualizados);
    saveUsers(atualizados);
    toast.success(user.ativo ? "Utilizador desativado" : "Utilizador reativado", {
      description: `O acesso de ${user.nome} foi atualizado.`,
    });
  }

  function excluirUtilizador(user: SessionUser) {
    if (user.id === sessao?.id) return;
    if (!window.confirm(`Excluir definitivamente o utilizador ${user.nome}?`)) return;

    const atualizados = utilizadores.filter((item) => item.id !== user.id);
    setUtilizadores(atualizados);
    saveUsers(atualizados);
    toast.success("Utilizador excluído", {
      description: "A conta foi removida do sistema.",
    });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Segurança e acessos"
        title="Utilizadores"
        action={
          <button
            type="button"
            onClick={() => navigate({ to: "/cadastro" })}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Novo utilizador
          </button>
        }
      />

      <section className="px-8 grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="glass rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-wider text-mut">Total</p>
            <p className="mt-2 text-3xl font-semibold">{utilizadores.length}</p>
            <p className="mt-1 text-xs text-mut">Contas registadas</p>
          </article>
          <article className="glass rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-wider text-mut">Ativos</p>
            <p className="mt-2 text-3xl font-semibold text-pass">{ativos}</p>
            <p className="mt-1 text-xs text-mut">Podem entrar no sistema</p>
          </article>
          <article className="glass rounded-xl p-5">
            <p className="text-[11px] uppercase tracking-wider text-mut">Inativos</p>
            <p className="mt-2 text-3xl font-semibold text-warn">{inativos}</p>
            <p className="mt-1 text-xs text-mut">Aguardam reativação ou exclusão</p>
          </article>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-2">
            <input
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar nome, e-mail ou perfil"
              className="bg-white text-gray-900 rounded-md px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <select
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value as FiltroEstado)}
              className="rounded-md px-3 py-2 text-sm"
            >
              <option>Todos</option>
              <option>Ativos</option>
              <option>Inativos</option>
            </select>
            <span className="ml-auto text-[11px] text-mut">
              {utilizadoresFiltrados.length} de {utilizadores.length} utilizadores
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Utilizador</th>
                  <th className="text-left font-medium py-2.5">E-mail</th>
                  <th className="text-left font-medium py-2.5">Perfil</th>
                  <th className="text-left font-medium py-2.5">Estado</th>
                  <th className="text-right font-medium py-2.5 pr-5">Ações</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {utilizadoresFiltrados.map((user) => {
                  const proprioUtilizador = user.id === sessao?.id;

                  return (
                    <tr key={user.id} className="border-b border-line/60 last:border-0">
                      <td className="py-3 px-5 text-foreground">{user.nome}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">{getRoleLabel(user.cargo)}</td>
                      <td className={`py-3 ${user.ativo ? "text-pass" : "text-warn"}`}>
                        {user.ativo ? "Ativo" : "Inativo"}
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={proprioUtilizador}
                            onClick={() => atualizarEstado(user)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {user.ativo ? "Desativar" : "Reativar"}
                          </button>
                          <button
                            type="button"
                            disabled={proprioUtilizador}
                            onClick={() => excluirUtilizador(user)}
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {utilizadoresFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-mut">
                      Nenhum utilizador corresponde aos filtros aplicados.
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
