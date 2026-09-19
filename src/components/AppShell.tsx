import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import secretaria from "@/assets/secretaria.jpg";
import { clearSession, getVisibleRoutes, readSession } from "@/lib/auth";
import { anoLetivo } from "@/lib/school-data";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-mut transition-colors hover:text-foreground"
      activeProps={{ className: "bg-surface text-foreground ring-1 ring-white/10" }}
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          <span
            className={`size-4 grid place-items-center font-semibold text-[10px] ${
              isActive ? "text-brand" : "text-mut/60"
            }`}
          >
            •
          </span>
          <span className={`text-sm ${isActive ? "font-medium" : ""}`}>{label}</span>
        </>
      )}
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-mut">{eyebrow}</p>
        <h1 className="text-2xl font-semibold text-balance mt-1">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <input
            className="bg-surface ring-1 ring-white/10 rounded-md pl-9 pr-3 py-2 text-sm placeholder:text-mut w-64 focus:outline-none focus:ring-2 focus:ring-brand/50"
            placeholder="Pesquisar aluno, turma, nº..."
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mut text-sm">🔍</span>
        </div>
        {action}
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(readSession());

  useEffect(() => {
    setSessao(readSession());
  }, []);

  const itens = useMemo(() => (sessao ? getVisibleRoutes(sessao.cargo) : []), [sessao]);

  function sair() {
    clearSession();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-180 h-180 drift rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.572 0.129 271 / 35%), transparent 60%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-50 w-160 h-160 drift2 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.53 0.086 194 / 32%), transparent 60%)",
          }}
        />
        <div
          className="absolute -bottom-55 left-1/3 w-140 h-140 drift rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.781 0.155 68 / 14%), transparent 60%)",
          }}
        />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-line/70 bg-ink2/50 backdrop-blur-xl hidden lg:flex flex-col">
          <Link to="/" className="px-5 py-5 flex items-center gap-3">
            <div className="size-9 grid place-items-center rounded-lg bg-brand text-ink font-semibold text-sm clip">
              GA
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm">Gestão Académica</p>
              <p className="text-[11px] text-mut">Ano Letivo {anoLetivo}</p>
            </div>
          </Link>

          <nav className="px-3">
            {itens.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>

          <div className="mt-auto p-4">
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-3">
                <img
                  src={secretaria}
                  alt="Retrato de Teresa M. Cabral, secretária da escola"
                  loading="lazy"
                  width={512}
                  height={512}
                  className="size-9 rounded-full object-cover"
                />
                <div className="leading-tight flex-1">
                  <p className="text-sm font-medium">{sessao?.nome ?? "Utilizador"}</p>
                  <p className="text-[11px] text-mut">{sessao?.cargo ?? "Acesso"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={sair}
                className="mt-3 w-full rounded-md border border-line bg-surface px-2 py-1.5 text-[11px] text-mut hover:text-foreground"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-8">{children}</main>
      </div>
    </div>
  );
}
