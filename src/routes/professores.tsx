import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  professores as professoresIniciais,
  disciplinas,
  turmas,
  type Professor,
} from "@/lib/school-data";
import { getRoleLabel, readSession, readUsers, saveUsers, type SessionUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PROFESSORES_STORAGE_KEY = "schoolwise:professores:v1";
type NovoProfessor = {
  nome: string;
  disciplina: string;
  turmas: string;
  contacto: string;
  senha: string;
  situacao: Professor["situacao"];
};

const professorVazio: NovoProfessor = {
  nome: "",
  disciplina: disciplinas[0]?.nome ?? "",
  turmas: turmas[0]?.nome ?? "",
  contacto: "",
  senha: "",
  situacao: "Efetivo" as const,
};
import { professores } from "@/lib/school-data";
import { getTeachers } from "@/api/Teacher";
import { Teacher } from "@/types/teacher.ds";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/professores")({
  head: () => ({
    meta: [
      { title: "Gestão de Professores — Gestão Académica" },
      {
        name: "description",
        content: "Corpo docente com disciplina lecionada, turmas atribuídas e situação contratual.",
      },
      { property: "og:title", content: "Gestão de Professores — Gestão Académica" },
      {
        property: "og:description",
        content: "Atribuição de turmas e disciplinas ao corpo docente.",
      },
    ],
  }),
  component: ProfessoresPage,
});

function ProfessoresPage() {
<<<<<<< HEAD
  const [professores, setProfessores] = useState<Professor[]>(professoresIniciais);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoProfessor, setNovoProfessor] = useState(professorVazio);
  const [utilizadores, setUtilizadores] = useState<SessionUser[]>([]);

  useEffect(() => {
    const guardados = window.localStorage.getItem(PROFESSORES_STORAGE_KEY);
    if (guardados) setProfessores(JSON.parse(guardados) as Professor[]);
    setUtilizadores(readUsers());
  }, []);

  function adicionarProfessor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = novoProfessor.contacto.trim().toLowerCase();
    const utilizadorExistente = utilizadores.some((user) => user.email === email);

    if (utilizadorExistente) {
      toast.error("E-mail já utilizado", {
        description: "Use um contacto diferente para criar o acesso deste professor.",
      });
      return;
    }

    const professor: Professor = {
      nome: novoProfessor.nome.trim(),
      disciplina: novoProfessor.disciplina,
      turmas: [novoProfessor.turmas],
      contacto: novoProfessor.contacto.trim(),
      situacao: novoProfessor.situacao,
    };
    const lista = [...professores, professor];
    const contaProfessor: SessionUser = {
      id: crypto.randomUUID(),
      nome: professor.nome,
      email,
      senha: novoProfessor.senha,
      cargo: "professor",
      disciplina: professor.disciplina,
      turmas: professor.turmas,
      ativo: true,
      criadoPor: readSession()?.email ?? "admin",
    };
    const utilizadoresAtualizados = [...utilizadores, contaProfessor];

    setProfessores(lista);
    setUtilizadores(utilizadoresAtualizados);
    window.localStorage.setItem(PROFESSORES_STORAGE_KEY, JSON.stringify(lista));
    saveUsers(utilizadoresAtualizados);
    setNovoProfessor(professorVazio);
    setFormularioAberto(false);
    toast.success("Professor cadastrado", {
      description: "O professor já pode entrar com o e-mail e a senha definidos.",
    });
  }

  function excluirUtilizador(userId: string) {
    const user = utilizadores.find((item) => item.id === userId);
    if (!user || user.id === readSession()?.id) return;

    if (!window.confirm(`Excluir o acesso de ${user.nome}?`)) return;

    const atualizados = utilizadores.filter((item) => item.id !== userId);
    setUtilizadores(atualizados);
    saveUsers(atualizados);
    toast.success("Utilizador excluído", {
      description: "O acesso ao sistema foi removido.",
    });
  }
=======

  const { data: professores = [] } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      return await getTeachers();
    },
  });
>>>>>>> 6ca60d113ffeab642df8b4579eb5fab744b17a3f

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Professores"
        action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Novo professor
          </button>
        }
      />

      <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {professores.map((p) => (
          <article key={p.nome} className="glass clip p-5">
            <div className="size-10 rounded-lg bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-brand font-semibold">
              {p.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <p className="text-sm font-medium mt-3">{p.nome}</p>
            <p className="text-[11px] text-mut">{p.disciplina}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.turmas.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-surface ring-1 ring-white/10 text-mut"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-mut mt-3 break-all">{p.contacto}</p>
            <p
              className={`text-[11px] mt-1 ${p.situacao === "Efetivo" ? "text-pass" : "text-warn"}`}
            >
              {p.situacao}
            </p>
          </article>
        ))}
      </section>

      <section className="px-8 mt-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Utilizadores do sistema</h2>
              <p className="text-[11px] text-mut mt-1">
                Contas ativas e inativas com acesso à plataforma.
              </p>
            </div>
            <span className="text-[11px] text-mut">{utilizadores.length} contas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Utilizador</th>
                  <th className="text-left font-medium py-2.5">E-mail</th>
                  <th className="text-left font-medium py-2.5">Perfil</th>
                  <th className="text-left font-medium py-2.5">Estado</th>
                  <th className="text-right font-medium py-2.5 pr-5">Ação</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {utilizadores.map((user) => (
                  <tr key={user.id} className="border-b border-line/60 last:border-0">
                    <td className="py-2.5 px-5 text-foreground">{user.nome}</td>
                    <td className="py-2.5">{user.email}</td>
                    <td className="py-2.5">{getRoleLabel(user.cargo)}</td>
                    <td className={`py-2.5 ${user.ativo ? "text-pass" : "text-warn"}`}>
                      {user.ativo ? "Ativo" : "Inativo"}
                    </td>
                    <td className="py-2.5 pr-5 text-right">
                      <button
                        type="button"
                        disabled={user.id === readSession()?.id}
                        onClick={() => excluirUtilizador(user.id)}
                        className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Dialog open={formularioAberto} onOpenChange={setFormularioAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo professor</DialogTitle>
            <DialogDescription>Registe o professor e as suas atribuições.</DialogDescription>
          </DialogHeader>
          <form onSubmit={adicionarProfessor} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Nome completo
              <input
                required
                value={novoProfessor.nome}
                onChange={(event) =>
                  setNovoProfessor({ ...novoProfessor, nome: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Disciplina
              <select
                value={novoProfessor.disciplina}
                onChange={(event) =>
                  setNovoProfessor({ ...novoProfessor, disciplina: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none"
              >
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.codigo}>{disciplina.nome}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Turma principal
              <select
                value={novoProfessor.turmas}
                onChange={(event) =>
                  setNovoProfessor({ ...novoProfessor, turmas: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none"
              >
                {turmas.map((turma) => (
                  <option key={turma.nome}>{turma.nome}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Contacto
              <input
                required
                type="email"
                value={novoProfessor.contacto}
                onChange={(event) =>
                  setNovoProfessor({ ...novoProfessor, contacto: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="professor@escola.ao"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Senha de acesso
              <input
                required
                minLength={6}
                type="password"
                value={novoProfessor.senha}
                onChange={(event) =>
                  setNovoProfessor({ ...novoProfessor, senha: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Situação
              <select
                value={novoProfessor.situacao}
                onChange={(event) =>
                  setNovoProfessor({
                    ...novoProfessor,
                    situacao: event.target.value as Professor["situacao"],
                  })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none"
              >
                <option>Efetivo</option>
                <option>Contratado</option>
              </select>
            </label>
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
                Adicionar professor
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
