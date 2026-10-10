import { Link } from "@tanstack/react-router";
import type { Turma } from "@/types/classroom.ds";

type ClassRoomOverviewProps = {
  turmas: Turma[];
};

export function ClassRoomOverview({ turmas }: ClassRoomOverviewProps) {
  const salas = Array.from(
    turmas.reduce((map, turma) => {
      const sala = turma.sala || "Sem sala";
      const atual = map.get(sala) ?? {
        sala,
        turmas: [] as Turma[],
        alunos: 0,
      };

      atual.turmas.push(turma);
      atual.alunos += turma.alunos || 0;
      map.set(sala, atual);
      return map;
    }, new Map<string, { sala: string; turmas: Turma[]; alunos: number }>()),
  ).map(([, value]) => value);

  const totalAlunos = turmas.reduce((total, turma) => total + (turma.alunos || 0), 0);
  const salasAtivas = salas.length;
  const ocupacaoMedia = salas.length
    ? Math.round(salas.reduce((total, sala) => total + sala.alunos, 0) / salas.length)
    : 0;

  return (
    <section className="px-4 sm:px-8 mt-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="glass rounded-xl border border-white/5 p-5 shadow-sm shadow-black/5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Classes</p>
          <p className="mt-2 text-3xl font-semibold">{turmas.length}</p>
          <p className="mt-1 text-xs text-mut">Turmas registadas no sistema</p>
        </article>

        <article className="glass rounded-xl border border-white/5 p-5 shadow-sm shadow-black/5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Salas</p>
          <p className="mt-2 text-3xl font-semibold">{salasAtivas}</p>
          <p className="mt-1 text-xs text-mut">Espaços ativos e atribuídos</p>
        </article>

        <article className="glass rounded-xl border border-white/5 p-5 shadow-sm shadow-black/5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-mut">Alunos</p>
          <p className="mt-2 text-3xl font-semibold text-pass">{totalAlunos}</p>
          <p className="mt-1 text-xs text-mut">Média por sala: {ocupacaoMedia}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="glass rounded-xl border border-white/5 p-5 shadow-sm shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Salas e ocupação</h2>
            <span className="text-[11px] text-mut">{salas.length} espaços</span>
          </div>

          <div className="space-y-3">
            {salas.map((sala) => (
              <div key={sala.sala} className="rounded-lg border border-line bg-surface/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sala {sala.sala}</p>
                    <p className="text-[11px] text-mut">
                      {sala.turmas.length} turma(s) · {sala.alunos} alunos
                    </p>
                  </div>
                  <span className="rounded-full border border-line bg-surface px-2 py-1 text-[10px] uppercase tracking-wider text-mut">
                    {sala.alunos > 25 ? "Lotada" : "Disponível"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl border border-white/5 p-5 shadow-sm shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Classes em destaque</h2>
            <Link to="/turmas" className="text-[11px] text-brand hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {turmas.slice(0, 5).map((turma) => (
              <Link
                key={turma.id}
                to="/turmas"
                className="flex items-center justify-between rounded-lg border border-line bg-surface/30 p-3 transition-colors hover:bg-surface"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{turma.nome}</p>
                  <p className="text-[11px] text-mut">Sala {turma.sala}</p>
                </div>
                <span className="text-xs text-mut">{turma.alunos} alunos</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
