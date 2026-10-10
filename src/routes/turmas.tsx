import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Turma, TurmaForm } from "@/types/classroom.ds";

import { AppShell, PageHeader } from "@/components/AppShell";
import { anoLetivo } from "@/lib/school-data";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getClassrooms } from "@/api/classrooms";

const turmaVazia: {
  id: number;
  letra: string;
  alunos: number;
  sala: string;
} = {
  id: 0,
  letra: "",
  alunos: 0,
  sala: "",
};

export const Route = createFileRoute("/turmas")({
  head: () => ({
    meta: [
      { title: "Gestão de Turmas — Gestão Académica" },
      {
        name: "description",
        content: "Turmas do ano letivo com diretor de turma, sala, número de alunos e média.",
      },
      { property: "og:title", content: "Gestão de Turmas — Gestão Académica" },
      { property: "og:description", content: "Organize turmas, salas e diretores de turma." },
    ],
  }),
  component: TurmasPage,
});

function TurmasPage() {
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaTurma, setNovaTurma] = useState(turmaVazia);
  const [turmaEditandoId, setTurmaEditandoId] = useState<number | null>(null);
  const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);

  const { data: turmasAPI = [], isLoading, isError, error } = useQuery<Turma[]>({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  });

  useEffect(() => {
    setListaTurmas(turmasAPI);
  }, [turmasAPI]);

  function resetFormulario() {
    setNovaTurma(turmaVazia);
    setTurmaEditandoId(null);
    setFormularioAberto(false);
  }

  function abrirEdicao(turma: Turma) {
    setNovaTurma({
      id: turma.id,
      letra: turma.letra,
      alunos: turma.alunos,
      sala: turma.sala,
    });
    setTurmaEditandoId(turma.id);
    setFormularioAberto(true);
  }

  function removerTurma(id: number) {
    setListaTurmas((prev) => prev.filter((turma) => turma.id !== id));
  }

  function adicionarTurma(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const turmaParaSalvar: Turma = {
      id: turmaEditandoId ?? Date.now(),
      nome: novaTurma.letra.trim() || "Turma",
      diretor: null,
      classe: 0,
      letra: novaTurma.letra,
      alunos: Number(novaTurma.alunos) || 0,
      sala: novaTurma.sala.trim(),
    };

    setListaTurmas((prev) => {
      if (turmaEditandoId !== null) {
        return prev.map((turma) => (turma.id === turmaEditandoId ? turmaParaSalvar : turma));
      }

      return [turmaParaSalvar, ...prev];
    });

    resetFormulario();
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title={`Turmas · Ano letivo ${anoLetivo}`}
        action={
          <button
            type="button"
            onClick={() => {
              setNovaTurma(turmaVazia);
              setTurmaEditandoId(null);
              setFormularioAberto(true);
            }}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova turma
          </button>
        }
      />

      {isLoading && (
        <section className="px-8 py-8">
          <p className="text-sm text-mut">A carregar turmas...</p>
        </section>
      )}

      {isError && (
        <section className="px-8 py-8">
          <div className="glass clip p-5">
            <p className="text-sm text-red-400">Não foi possível carregar as turmas.</p>
            {error instanceof Error && <p className="text-xs text-mut mt-2">{error.message}</p>}
          </div>
        </section>
      )}

      {!isLoading && !isError && (
        <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {listaTurmas.map((t) => (
            <article key={t.id} className="glass clip border border-white/5 p-5 shadow-sm shadow-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold mt-1">{t.nome}</h2>
                </div>

                <span className="rounded-full bg-surface px-2 py-1 text-[11px] ring-1 ring-white/10 text-mut">
                  Sala {t.sala}
                </span>
              </div>

              <p className="mt-3 text-sm text-mut">Diretor(a): {t.diretor || "—"}</p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-mut">Alunos</p>
                  <p className="text-lg font-semibold">{t.alunos}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(t)}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removerTurma(t.id)}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-fail hover:bg-fail/10"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}

          {listaTurmas.length === 0 && (
            <div className="col-span-full">
              <div className="glass clip p-8 text-center">
                <p className="text-sm text-mut">Nenhuma turma encontrada.</p>
              </div>
            </div>
          )}
        </section>
      )}

      <Dialog open={formularioAberto} onOpenChange={(open) => {
        if (!open) resetFormulario();
        else setFormularioAberto(true);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{turmaEditandoId !== null ? "Editar turma" : "Nova turma"}</DialogTitle>
            <DialogDescription>
              {turmaEditandoId !== null
                ? "Atualize os dados desta turma."
                : "Preencha os dados da turma para a guardar no sistema."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={adicionarTurma} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="letra-turma" className="text-sm font-medium">
                  Turma
                </label>

                <input
                  id="letra-turma"
                  required
                  value={novaTurma.letra}
                  onChange={(event) =>
                    setNovaTurma({
                      ...novaTurma,
                      letra: event.target.value.toUpperCase(),
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Ex.: A"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="sala-turma" className="text-sm font-medium">
                  Sala
                </label>

                <input
                  id="sala-turma"
                  required
                  value={novaTurma.sala}
                  onChange={(event) =>
                    setNovaTurma({
                      ...novaTurma,
                      sala: event.target.value,
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Ex.: B-12"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="alunos-turma" className="text-sm font-medium">
                Capacidade da Turma (nº de alunos)
              </label>

              <input
                id="alunos-turma"
                type="number"
                min="0"
                required
                value={novaTurma.alunos}
                onChange={(event) =>
                  setNovaTurma({
                    ...novaTurma,
                    alunos: parseInt(event.target.value) || 0,
                  })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={resetFormulario}
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                {turmaEditandoId !== null ? "Guardar alterações" : "Adicionar turma"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}