import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery } from "@tanstack/react-query";
import { Room, RoomAPI } from "@/types/room.ds";
import { getRooms, postRoom, putRoom, transformRoomToRoomAPI } from "@/api/rooms";
import { postClassRoom } from "@/api/classrooms";
import { TurmaForm } from "@/types/classroom.ds";
import { TrButtonActions } from "@/components/TrButtonActions";
    
const salaVazia: RoomAPI = {
                      id:0,
                      code: "",
                      name: "",
                      description: "",
                      room_type: "",
                      capacity: 0,
                      building: "",
                      floor: "",
                      status: "active",
                      observation: "",
                      updated_at:"",
                      created_at:""
                    }


export const Route = createFileRoute("/salas")({
  head: () => ({
    meta: [
      { title: "Salas — Gestão Académica" },
      { name: "description", content: "Gestão de salas" },
    ],
  }),
  component: SalasPage,
});

function SalasPage() {
      const { data: salas = [] } = useQuery<Room[]>({
      queryKey: ["rooms"],
      queryFn: async () => {

        return await getRooms()
      },
    });

    const [formularioAberto, setFormularioAberto] = useState(false);
    const [novaSala, setNovaSala] = useState(salaVazia);
    const [edicaoAberta, setEdicaoAberta] = useState(false);
    

  async function adicionarAtualizarSala(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();    
      
    if(edicaoAberta){
          await putRoom(novaSala)
          setEdicaoAberta(false)
        }else{
          const result = await postRoom(novaSala);
        }

    setNovaSala(salaVazia);
    setFormularioAberto(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Salas de Aulas"
        title="Salas"
         action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova sala
          </button>
        }
        />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="text-sm font-semibold">Total de salas de aula</h2>
            <span className="text-[11px] text-mut">{salas.length} salas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
    <thead>
      <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
        <th className="text-left font-medium py-2.5 px-5">Código</th>
        <th className="text-left font-medium py-2.5 px-4">Nome</th>
        <th className="text-left font-medium py-2.5">Tipo</th>
        <th className="text-left font-medium py-2.5 px-5">Capacidade</th>
        <th className="text-left font-medium py-2.5 px-2">Estado</th>
        <th className="text-left font-medium py-2.5 px-4">Edifício</th>
        <th className="text-left font-medium py-2.5 px-4">Piso</th>
        <th className="text-left font-medium py-2.5 px-4">Observações</th>
        <th className="text-left font-medium py-2.5 px-4">Descrição</th>
      </tr>
    </thead>

  <tbody className="text-mut">
    {salas.map((sala) => (
      <tr
        key={sala.id}
        className="border-b border-line/60 last:border-0 hover:bg-surface"
      >
        <td className="py-2.5 px-5 text-brand">{sala.codigo}</td>
        <td className="py-2.5 px-4 text-foreground">{sala.nome}</td>
        <td className="py-2.5">{sala.tipo}</td>
        <td className="py-2.5 px-5">{sala.capacidade}</td>
        <td className="py-2.5 px-2 text-pass">{sala.estado}</td>
        <td className="py-2.5 px-4">{sala.edificio}</td>
        <td className="py-2.5 px-4">{sala.piso}</td>
        <td className="py-2.5 px-4">{sala.observacoes}</td>
        <td className="py-2.5 px-4">{sala.descricao}</td>
        <td>
          <TrButtonActions
          deleteLabel="Remover"
          editLabel="Editar"
          onDeleteClick={()=>{}}
          onUpdateClick={
            () =>{ 
              setNovaSala(transformRoomToRoomAPI(sala))          
              setFormularioAberto(true)
              setEdicaoAberta(true)
            }
          }
          canDelete={true}
          />
          <div>
          </div>
          </td>
      </tr>
    ))}

    {salas.length === 0 && (
      <tr>
        <td colSpan={9} className="py-10 text-center text-mut">
          Nenhuma sala encontrada.
        </td>
      </tr>
    )}
  </tbody>
</table>
          </div>
        </div>
      </section>

            <DialogSala
              aberto={formularioAberto}
              valor={novaSala}
              onChange={setNovaSala}
              onEdit={() => setEdicaoAberta(true)}
              onCancel={()=>{
                  setFormularioAberto(false)
                  setEdicaoAberta(false)
                  setNovaSala(salaVazia)
              
              }}
              onClose={() =>{
                if(edicaoAberta){
                  setEdicaoAberta(false)
                  setNovaSala(salaVazia)
                }
                setFormularioAberto(false)
              } }
              onSubmit={adicionarAtualizarSala}
            />
    </AppShell>
  );
}

export function DialogSala({
  aberto,
  valor,
  onChange,
  onEdit,
  onClose,
  onSubmit,
  onCancel
}: {
  aberto: boolean;
  valor: typeof salaVazia;
  onChange: (valor: typeof salaVazia) => void;
  onEdit: () => void;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      <div className="glass w-full max-w-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold">Nova inscrição</h2>
        <p className="text-sm text-mut mt-1">Registe a candidatura para análise da secretaria.</p>
          <form
              onSubmit={onSubmit}
              className="grid gap-4 mt-5"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={valor.code}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      code: event.target.value,
                    })
                  }
                  placeholder="Código (ex.: A101)"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />

                <input
                  required
                  value={valor.name}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      name: event.target.value,
                    })
                  }
                  placeholder="Nome da sala"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>

              <textarea
                value={valor.description}
                onChange={(event) =>
                  onChange({
                    ...valor,
                    description: event.target.value,
                  })
                }
                placeholder="Descrição da sala (opcional)"
                rows={2}
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  required
                  value={valor.room_type}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      room_type: event.target.value,
                    })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                >
                  <option value="">Tipo de sala</option>
                  <option value="classroom">Sala de aula</option>
                  <option value="computer_lab">Laboratório de informática</option>
                  <option value="science_lab">Laboratório de ciências</option>
                  <option value="library">Biblioteca</option>
                  <option value="auditorium">Auditório</option>
                  <option value="other">Outro</option>
                </select>

                <input
                  type="number"
                  min={1}
                  value={valor.capacity}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      capacity: Number(event.target.value),
                    })
                  }
                  placeholder="Capacidade (alunos)"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={valor.building}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      building: event.target.value,
                    })
                  }
                  placeholder="Edifício / Bloco"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />

                <input
                  value={valor.floor}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      floor: event.target.value,
                    })
                  }
                  placeholder="Piso (ex.: R/C)"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>

              <select
                required
                value={valor.status}
                onChange={(event) =>
                  onChange({
                    ...valor,
                    status: event.target.value,
                  })
                }
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
              >
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
                <option value="maintenance">Em manutenção</option>
              </select>

              <textarea
                value={valor.observation}
                onChange={(event) =>
                  onChange({
                    ...valor,
                    observation: event.target.value,
                  })
                }
                placeholder="Observações (opcional)"
                rows={2}
                className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
                >
                  Guardar sala
                </button>
              </div>
            </form>
      </div>
    </div>
  );
}