import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomForm, Room} from "@/types/room.ds";

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

import { getRoom, postRoom } from "@/api/room";


const salaVazia: {
  id: number;
  sala: string;
 
} = {
  id: 0,
  sala: "",
};

export const Route = createFileRoute("/sala")({
  head: () => ({
    meta: [
      { title: "Gestão de Salas — Gestão Académica" },
      {
        name: "description",

      },
      { property: "og:title", content: "Gestão de Salas — Gestão Académica" },
      { property: "og:description", content: "Organize salas" },
    ],
  }),
  component: SalaPage,
});

function SalaPage() {
  const queryClient = useQueryClient();
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaSala, setNovaSala] = useState<RoomForm>(salaVazia);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  const [salaEditandoId, setSalaEditandoId] = useState<number | null >(null);
  const [listaSalas, setListaSalas] = useState<Room[]>([]);

  const { data: RoomAPI = [], isLoading, isError, error } = useQuery<Room[]>({
    queryKey: ["room"],
    queryFn: getRoom,
  });

  useEffect(() => {
    setListaSalas(RoomAPI);
  }, [RoomAPI]);

  function resetFormulario() {
    setNovaSala(salaVazia);
    setSalaEditandoId(null);
    setErroFormulario(null);
    setFormularioAberto(false);
  }

  function abrirEdicao(room: RoomForm) {
    setNovaSala({
      id: room.id,
     sala: room.sala,
    });
    setSalaEditandoId(room.id);
    setFormularioAberto(true);
  }

  function removerSala(id: number) {
    setListaSalas((prev) => prev.filter((room) => room.id !== id));
  }

  async function adicionarSala(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();


    const salaParaSalvar: Room = {
      id: salaEditandoId ?? Date.now(),
      sala: novaSala.sala.trim() || "Sala",
    };

    if (salaEditandoId !== null) {
      setListaSalas((prev) =>
        prev.map((room) => (room.id === salaEditandoId ? salaParaSalvar : room)),
      );
      resetFormulario();
      return;
    }

    setAGuardar(true);
    setErroFormulario(null);
    try {
      const salaCriada = await postRoom({
        sala: novaSala.sala.trim()
      });

      setListaSalas((prev) => [salaCriada, ...prev]);
      queryClient.setQueryData<RoomForm[]>(["room"], (current = []) => [
        salaCriada,
        ...current.filter((sala) => sala.id !== salaCriada.id),
      ]);
      await queryClient.invalidateQueries({ queryKey: ["room"] });
      resetFormulario();
    } catch (error) {
      setErroFormulario(
        error instanceof Error
          ? `Não foi possível guardar a sala: ${error.message}`
          : "Não foi possível guardar a sala. Tente novamente.",
      );
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title={`Salas · Ano letivo ${anoLetivo}`}
        action={
          <button
            type="button"
            onClick={() => {
              setNovaSala(salaVazia);
              setSalaEditandoId(null);
              setFormularioAberto(true);
            }}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova sala
          </button>
        }
      />

      {isLoading && (
        <section className="px-8 py-8">
          <p className="text-sm text-mut">A carregar salas...</p>
        </section>
      )}

      {isError && (
        <section className="px-8 py-8">
          <div className="glass clip p-5">
            <p className="text-sm text-red-400">Não foi possível carregar as salas.</p>
            {error instanceof Error && <p className="text-xs text-mut mt-2">{error.message}</p>}
          </div>
        </section>
      )}

      {!isLoading && !isError && (
        <section className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {listaSalas.map((s) => (
            <article key={s.id} className="glass clip border border-white/5 p-5 shadow-sm shadow-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold mt-1">{s.sala}</h2>
                </div>

                <span className="rounded-full bg-surface px-2 py-1 text-[11px] ring-1 ring-white/10 text-mut">
                  Sala {s.sala}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(s)}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removerSala(s.id)}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-fail hover:bg-fail/10"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}

          {listaSalas.length === 0 && (
            <div className="col-span-full">
              <div className="glass clip p-8 text-center">
                <p className="text-sm text-mut">Nenhuma sala encontrada.</p>
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
            <DialogTitle>{salaEditandoId !== null ? "Editar sala" : "Nova sala"}</DialogTitle>
            <DialogDescription>
              {salaEditandoId !== null
                ? "Atualize os dados desta sala."
                : "Preencha os dados da sala para guardar no sistema."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={adicionarSala} className="grid gap-4">
            {erroFormulario && (
              <p className="text-sm text-red-400" role="alert">
                {erroFormulario}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="letra-sala" className="text-sm font-medium">
                  Sala
                </label>

                <input
                  id="letra-sala"
                  required
                  value={novaSala.sala}
                  onChange={(event) =>
                    setNovaSala({
                      ...novaSala,
                      sala: event.target.value.toUpperCase(),
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Ex.: 02 ou 2C ou 0-2"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={resetFormulario}
                disabled={aGuardar}
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={aGuardar}
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                {aGuardar
                  ? "A guardar..."
                  : salaEditandoId !== null
                    ? "Guardar alterações"
                    : "Adicionar sala"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
