import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  authorizeUserRegistration,
  readUsers,
  saveUsers,
  type SessionUser,
  type UserRole,
} from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro de utilizadores — Gestão Académica" },
      {
        name: "description",
        content: "Cadastro de utilizadores com nível de acesso e perfil funcional.",
      },
    ],
  }),
  component: CadastroPage,
});

const initialForm = {
  nome: "",
  email: "",
  senha: "",
  cargo: "secretario" as UserRole,
};

function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(true);
  const [securityForm, setSecurityForm] = useState({ identifier: "", accessKey: "" });

  function authorizeAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authorizeUserRegistration(securityForm.identifier, securityForm.accessKey)) {
      toast.error("Autorização recusada", {
        description: "Use o nome ou e-mail e a palavra-passe de um admin ou da direção.",
      });
      return;
    }

    setSecurityOpen(false);
    setSecurityForm({ identifier: "", accessKey: "" });
    toast.success("Acesso autorizado", {
      description: "Pode agora cadastrar um utilizador do sistema.",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const users = readUsers();
    const existing = users.find(
      (user) => user.email.toLowerCase() === form.email.trim().toLowerCase(),
    );

    if (existing) {
      toast.error("E-mail já registado", {
        description: "Este utilizador já está cadastrado no sistema.",
      });
      setSubmitting(false);
      return;
    }

    const novoUsuario: SessionUser = {
      id: crypto.randomUUID(),
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      senha: form.senha,
      cargo: form.cargo,
      ativo: true,
      criadoPor: "admin",
    };

    saveUsers([...users, novoUsuario]);
    toast.success("Utilizador criado", {
      description: `O perfil ${form.cargo} foi registado com sucesso.`,
    });
    setForm(initialForm);
    setSubmitting(false);
    navigate({ to: "/login" });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Segurança"
        title="Cadastro de utilizadores"
        action={
          <button
            type="button"
            onClick={() => navigate({ to: "/usuarios" })}
            className="rounded-md border border-line px-3 py-2 text-sm"
          >
            Voltar aos utilizadores
          </button>
        }
      />

      <section className="px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface/80 p-6">
          <h2 className="text-lg font-semibold">Registrar novo utilizador</h2>
          <p className="mt-1 text-sm text-mut">
            O admin, secretário(a) ou DP podem criar contas para professores, secretários e demais
            acessos autorizados.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="text-mut">Nome completo</span>
              <input
                required
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-mut">E-mail institucional</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-mut">Palavra-passe</span>
              <input
                required
                type="password"
                value={form.senha}
                onChange={(event) => setForm({ ...form, senha: event.target.value })}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-mut">Nível de acesso</span>
              <select
                value={form.cargo}
                onChange={(event) => setForm({ ...form, cargo: event.target.value as UserRole })}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value="secretario">Secretário(a)</option>
                <option value="dp">Direção Pedagógica</option>
                <option value="admin">Admin / Direção Geral</option>
              </select>
            </label>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {submitting ? "A guardar..." : "Guardar utilizador"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Dialog open={securityOpen} onOpenChange={() => undefined}>
        <DialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Autorização de segurança</DialogTitle>
            <DialogDescription>
              Esta área é restrita. Confirme a identidade de um administrador ou da direção para
              cadastrar utilizadores.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={authorizeAccess} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              E-mail ou nome de utilizador autorizado
              <input
                required
                value={securityForm.identifier}
                onChange={(event) =>
                  setSecurityForm({ ...securityForm, identifier: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                autoComplete="username"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Chave de acesso
              <input
                required
                type="password"
                value={securityForm.accessKey}
                onChange={(event) =>
                  setSecurityForm({ ...securityForm, accessKey: event.target.value })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                autoComplete="current-password"
              />
            </label>
            <DialogFooter>
              <button
                type="button"
                onClick={() => navigate({ to: "/usuarios" })}
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                Autorizar cadastro
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
