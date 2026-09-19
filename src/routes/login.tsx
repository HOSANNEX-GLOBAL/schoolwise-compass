import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authenticate, saveSession } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Gestão Académica" },
      { name: "description", content: "Acesso seguro à plataforma escolar por nível de acesso." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@escola.ao");
  const [senha, setSenha] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const result = authenticate(email, senha);

    if (!result.ok) {
      toast.error("Acesso bloqueado", {
        description: result.message,
      });
      setSubmitting(false);
      return;
    }

    saveSession(result.user);
    toast.success("Autenticação concluída", {
      description: `Bem-vindo(a), ${result.user.nome}.`,
    });
    navigate({ to: "/dashboard" });
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-ink text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center gap-8 px-4 py-10">
        <div className="hidden flex-1 lg:block">
          <div className="glass rounded-3xl p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-mut">Sistema escolar</p>
            <h1 className="mt-4 text-4xl font-semibold text-balance">
              Gestão académica e controlo de acesso
            </h1>
            <p className="mt-4 max-w-md text-sm text-mut">
              Autenticação por perfil, controlo hierárquico, validação de professor e gestão de
              dados com sigilo profissional.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Professor(a)", "Registo de notas por turma, disciplina e classe."],
                ["Secretário(a)", "Gestão de alunos, matrículas e documentos."],
                ["DP", "Controlo de processos e acompanhamento pedagógico."],
                ["Admin", "Cadastro de utilizadores e gestão institucional."],
              ].map(([cargo, descricao]) => (
                <div key={cargo} className="rounded-xl border border-line bg-surface/70 p-4">
                  <p className="text-sm font-semibold">{cargo}</p>
                  <p className="mt-1 text-xs text-mut">{descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-line bg-surface/90 p-6 shadow-2xl ring-1 ring-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-mut">Acesso</p>
          <h2 className="mt-3 text-2xl font-semibold">Entrar no sistema</h2>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              <span className="text-mut">E-mail institucional</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="nome@escola.ao"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-mut">Palavra-passe</span>
              <input
                required
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="bg-ink2 rounded-md border border-line px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="••••••••"
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a href="/cadastro" className="text-xs text-brand hover:underline">
                Criar utilizador
              </a>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {submitting ? "A verificar..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-lg border border-line bg-ink2/60 p-3 text-xs text-mut">
            <p className="font-medium text-foreground">Credenciais de demonstração</p>
            <p className="mt-2">Admin: admin@escola.ao / admin123</p>
            <p>Secretária: secretaria@escola.ao / secretaria123</p>
            <p>DP: dp@escola.ao / dp123</p>
            <p>Professor: almeida@escola.ao / prof123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
