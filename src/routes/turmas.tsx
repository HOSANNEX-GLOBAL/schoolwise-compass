import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { AppShell, PageHeader } from "@/components/AppShell";

import {
  anoLetivo,
  classesEnsinoGeral,
  cicloDaClasse,
  maxNotaDaTurma,
  type Turma,
} from "@/lib/school-data";

import { TurmaApi } from "@/types/classroom.ds";
import { api } from "@/api/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const turmaVazia: {
  classe: (typeof classesEnsinoGeral)[number];
  letra: string;
  diretor: string;
  alunos: string;
  sala: string;
  mediaTurma: string;
} = {
  classe: classesEnsinoGeral[0],
  letra: "A",
  diretor: "",
  alunos: "0",
  sala: "",
  mediaTurma: "0",
};

export const Route = createFileRoute("/turmas")({
  head: () => ({
    meta: [
      {
        title: "Gestão de Turmas — Gestão Académica",
      },
      {
        name: "description",
        content:
          "Turmas do ano letivo com diretor de turma, sala, número de alunos e média.",
      },
      {
        property: "og:title",
        content: "Gestão de Turmas — Gestão Académica",
      },
      {
        property: "og:description",
        content: "Organize turmas, salas e diretores de turma.",
      },
    ],
  }),

  component: TurmasPage,
});

function TurmasPage() {
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaTurma, setNovaTurma] = useState(turmaVazia);

  const {
    data: turmas = [],
    isLoading,
    isError,
    error,
  } = useQuery<Turma[]>({
    queryKey: ["classrooms"],

    queryFn: async () => {
      const response = await api.get("/classrooms");

      const turmasData: Turma[] = response.data.map(
        (turma: TurmaApi) => ({
          nome: turma.name,
          ciclo: turma.cycle,
          diretor: turma.teacher?.name ?? "",
          alunos: turma.capacity,
          sala: turma.room,
          mediaTurma: turma.class_average,
        })
      );

      return turmasData;
    },
  });

  function adicionarTurma(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * Neste momento o formulário continua apenas a preparar
     * os dados da nova turma.
     *
     * Para persistir no backend, o próximo passo será:
     *
     * await api.post("/classrooms", {...})
     *
     * e depois invalidar a query ["classrooms"].
     */

    console.log("Nova turma:", {
      nome: `${novaTurma.classe} ${novaTurma.letra}`,
      ciclo: cicloDaClasse(novaTurma.classe),
      diretor: novaTurma.diretor.trim(),
      alunos: Number(novaTurma.alunos),
      sala: novaTurma.sala.trim(),
      mediaTurma: Number(novaTurma.mediaTurma),
    });

    setNovaTurma(turmaVazia);
    setFormularioAberto(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title={`Turmas · Ano letivo ${anoLetivo}`}
        action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova turma
          </button>
        }
      />

      {isLoading && (
        <section className="px-8 py-8">
          <p className="text-sm text-mut">
            A carregar turmas...
          </p>
        </section>
      )}

      {isError && (
        <section className="px-8 py-8">
          <div className="glass clip p-5">
            <p className="text-sm text-red-400">
              Não foi possível carregar as turmas.
            </p>

            {error instanceof Error && (
              <p className="text-xs text-mut mt-2">
                {error.message}
              </p>
            )}
          </div>
        </section>
      )}

      {!isLoading && !isError && (
        <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {turmas.map((t) => (
            <article
              key={t.nome}
              className="glass clip p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-mut">
                    {t.ciclo}
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    {t.nome}
                  </h2>
                </div>

                <span className="text-[11px] px-2 py-1 rounded-full bg-surface ring-1 ring-white/10 text-mut">
                  Sala {t.sala}
                </span>
              </div>

              <p className="text-sm text-mut mt-3">
                Diretor(a): {t.diretor}
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-mut">
                    Alunos
                  </p>

                  <p className="text-lg font-semibold">
                    {t.alunos}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] text-mut">
                    Média da turma
                  </p>

                  <p className="text-lg font-semibold text-brand">
                    {t.mediaTurma}
                  </p>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-surface-strong mt-3">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{
                    width: `${Math.min(
                      (Number(t.mediaTurma) /
                        maxNotaDaTurma(t.nome)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </article>
          ))}

          {turmas.length === 0 && (
            <div className="col-span-full">
              <div className="glass clip p-8 text-center">
                <p className="text-sm text-mut">
                  Nenhuma turma encontrada.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <Dialog
        open={formularioAberto}
        onOpenChange={setFormularioAberto}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Nova turma
            </DialogTitle>

            <DialogDescription>
              Preencha os dados da turma para a guardar no sistema.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={adicionarTurma}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <label
                htmlFor="nome-turma"
                className="text-sm font-medium"
              >
                Classe
              </label>

              <select
                id="nome-turma"
                required
                value={novaTurma.classe}
                onChange={(event) =>
                  setNovaTurma({
                    ...novaTurma,
                    classe:
                      event.target.value as (typeof classesEnsinoGeral)[number],
                  })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {classesEnsinoGeral.map((classe) => (
                  <option
                    key={classe}
                    value={classe}
                  >
                    {classe}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="letra-turma"
                  className="text-sm font-medium"
                >
                  Turma
                </label>

                <input
                  id="letra-turma"
                  required
                  value={novaTurma.letra}
                  onChange={(event) =>
                    setNovaTurma({
                      ...novaTurma,
                      letra:
                        event.target.value.toUpperCase(),
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Ex.: A"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="sala-turma"
                  className="text-sm font-medium"
                >
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
              <label
                htmlFor="diretor-turma"
                className="text-sm font-medium"
              >
                Diretor(a)
              </label>

              <input
                id="diretor-turma"
                required
                value={novaTurma.diretor}
                onChange={(event) =>
                  setNovaTurma({
                    ...novaTurma,
                    diretor: event.target.value,
                  })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="Ex.: Prof. Almeida Cunha"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="alunos-turma"
                  className="text-sm font-medium"
                >
                  N.º de alunos
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
                      alunos: event.target.value,
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="media-turma"
                  className="text-sm font-medium"
                >
                  Média da turma
                </label>

                <input
                  id="media-turma"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  required
                  value={novaTurma.mediaTurma}
                  onChange={(event) =>
                    setNovaTurma({
                      ...novaTurma,
                      mediaTurma: event.target.value,
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() =>
                  setFormularioAberto(false)
                }
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                Adicionar turma
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}