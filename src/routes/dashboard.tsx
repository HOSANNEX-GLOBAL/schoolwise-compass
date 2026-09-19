import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { alunos, disciplinas, media, turmas } from "@/lib/school-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Gestão Académica" },
      {
        name: "description",
        content: "Visão geral da gestão académica e dos principais indicadores escolares.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const mediaGeral = alunos.reduce((total, aluno) => total + media(aluno.notas), 0) / alunos.length;
  const aprovacao = Math.round(
    (alunos.filter((aluno) => media(aluno.notas) >= 6).length / alunos.length) * 100,
  );
  const totalAlunos = turmas.reduce((total, turma) => total + turma.alunos, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Painel de gestão"
        title="Dashboard"
        action={
          <Link
            to="/notas"
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            Ver notas
          </Link>
        }
      />

      <section className="px-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-wider text-mut">Alunos matriculados</p>
          <p className="mt-2 text-3xl font-semibold">{totalAlunos}</p>
          <p className="mt-1 text-xs text-mut">Distribuídos por {turmas.length} turmas</p>
        </article>
        <article className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-wider text-mut">Turmas ativas</p>
          <p className="mt-2 text-3xl font-semibold">{turmas.length}</p>
          <p className="mt-1 text-xs text-mut">Ensino geral</p>
        </article>
        <article className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-wider text-mut">Disciplinas</p>
          <p className="mt-2 text-3xl font-semibold">{disciplinas.length}</p>
          <p className="mt-1 text-xs text-mut">Plano curricular ativo</p>
        </article>
        <article className="glass clip p-5">
          <p className="text-[11px] uppercase tracking-wider text-mut">Aprovação estimada</p>
          <p className="mt-2 text-3xl font-semibold text-pass">{aprovacao}%</p>
          <p className="mt-1 text-xs text-mut">Média geral: {mediaGeral.toFixed(1)}</p>
        </article>
      </section>

      <section className="px-8 mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold">Acompanhamento académico</h2>
          <p className="mt-2 text-sm leading-6 text-mut">
            Consulte alunos, turmas, disciplinas e resultados a partir da navegação lateral.
            Professores encontram aqui o acesso rápido ao lançamento de notas.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/alunos" className="rounded-md bg-surface px-3 py-2 text-xs text-foreground">
              Consultar alunos
            </Link>
            <Link to="/turmas" className="rounded-md bg-surface px-3 py-2 text-xs text-foreground">
              Consultar turmas
            </Link>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold">Acesso rápido</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/inscricao"
              className="rounded-lg border border-line p-3 text-sm hover:bg-surface"
            >
              Inscrições
            </Link>
            <Link
              to="/matricula"
              className="rounded-lg border border-line p-3 text-sm hover:bg-surface"
            >
              Matrículas
            </Link>
            <Link
              to="/documentos"
              className="rounded-lg border border-line p-3 text-sm hover:bg-surface"
            >
              Documentos
            </Link>
            <Link
              to="/estatisticas"
              className="rounded-lg border border-line p-3 text-sm hover:bg-surface"
            >
              Estatísticas
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
