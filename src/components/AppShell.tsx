import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import secretaria from "@/assets/secretaria.jpg";
import { anoLetivo } from "@/lib/school-data";

const academico = [
  { to: "/alunos", label: "Alunos" },
  { to: "/turmas", label: "Turmas" },
  { to: "/disciplinas", label: "Disciplinas" },
  { to: "/professores", label: "Professores" },
] as const;

const processos = [
  { to: "/notas", label: "Notas" },
  { to: "/documentos", label: "Documentos" },
  { to: "/estatisticas", label: "Estatísticas" },
] as const;

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
  return (
    <div className="min-h-screen bg-ink">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[720px] h-[720px] drift rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.572 0.129 271 / 35%), transparent 60%)" }}
        />
        <div
          className="absolute top-1/3 right-[-200px] w-[640px] h-[640px] drift2 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.53 0.086 194 / 32%), transparent 60%)" }}
        />
        <div
          className="absolute bottom-[-220px] left-1/3 w-[560px] h-[560px] drift rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.781 0.155 68 / 14%), transparent 60%)" }}
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
            <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-mut/80">Académico</p>
            {academico.map((i) => (
              <NavItem key={i.to} to={i.to} label={i.label} />
            ))}
            <p className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-[0.18em] text-mut/80">Processos</p>
            {processos.map((i) => (
              <NavItem key={i.to} to={i.to} label={i.label} />
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
                <div className="leading-tight">
                  <p className="text-sm font-medium">Teresa M. Cabral</p>
                  <p className="text-[11px] text-mut">Secretária</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-8">{children}</main>
      </div>
    </div>
  );
}
