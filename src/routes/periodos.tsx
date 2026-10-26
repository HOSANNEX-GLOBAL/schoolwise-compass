import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useQuery } from "@tanstack/react-query";
import { getPeriods, postPeriod, putPeriod, transformPeriodToPeriodAPI } from "@/api/periods";
import { Period, PeriodAPI } from "@/types/period.ds";
import { formatTime } from "@/lib/formatTime";
import { TrButtonActions } from "@/components/TrButtonActions";


export const Route = createFileRoute("/periodos")({
  head: () => ({
    meta: [
      { title: "Períodos — Gestão Académica" },
      { name: "description", content: "Gestão de salas" },
    ],
  }),
  component: PeriodosPage,
});

const periodoVazio: PeriodAPI = {
            id: 0,
            name:"",
            start_time:"",
            end_time:"",
            status: "",
            created_at: "",
            updated_at: ""
          }
          
function PeriodosPage() {
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [novoPeriodo, setNovoPeriodo] = useState(periodoVazio);
    const [edicaoAberta, setEdicaoAberta] = useState(false);


    const { data: periodos = [] } = useQuery<Period[]>({
      queryKey: ["periods"],
      queryFn: async () => {
        return await getPeriods();
      },
    });

      async function adicionarAtualizarPeriodo(event: FormEvent<HTMLFormElement>) {
       event.preventDefault();    
         
       if(edicaoAberta){
             await putPeriod(novoPeriodo)
             setEdicaoAberta(false)
           }else{
             const result = await postPeriod(novoPeriodo);
           }

       setNovoPeriodo(periodoVazio);
       setFormularioAberto(false);
     }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Períodos de Aulas"
        title="Períodos"
         action={
           <button
             type="button"
             onClick={() => setFormularioAberto(true)}
             className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
           >
             + Nova Período
           </button>
        }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="text-sm font-semibold">Total de períodos</h2>
            <span className="text-[11px] text-mut">{periodos.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-4">Nome</th>
                  <th className="text-left font-medium py-2.5 px-4">Ínicio</th>
                  <th className="text-left font-medium py-2.5 px-4">Fim</th>
                  <th className="text-left font-medium py-2.5 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {periodos.map((periodo) => (
                  <tr
                    key={periodo.id}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    
                    <td className="py-2.5 px-4 text-brand">{periodo.nome}</td>
                    <td className="py-2.5 px-4 text-foreground">{periodo.hora_inicio}</td>
                    <td className="py-2.5 px-4">{periodo.hora_fim}</td>
                    <td className="py-2.5 px-4">{periodo.estado}</td>
                    <td className="py-2.5 px-4">
                    <TrButtonActions
                    onUpdateClick={()=>{
                      setNovoPeriodo(transformPeriodToPeriodAPI(periodo))
                      setEdicaoAberta(true)
                      setFormularioAberto(true)
                    }}
                    onDeleteClick={()=>{}}
                    editLabel="editar"
                    deleteLabel="remover"
                    canDelete={true}
                    /></td>
                  </tr>
                ))}
                {periodos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-mut">
                      Nenhum período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

          <DialogPeriodo
            aberto={formularioAberto}
            valor={novoPeriodo}
            onChange={setNovoPeriodo}
            onEdit={() => setEdicaoAberta(true)}
            onCancel={()=>{
                setFormularioAberto(false)
                setEdicaoAberta(false)
                setNovoPeriodo(periodoVazio)
            
            }}
            onClose={() =>{
              if(edicaoAberta){
                setEdicaoAberta(false)
                setNovoPeriodo(periodoVazio)
              }
              setFormularioAberto(false)
            } }
            onSubmit={adicionarAtualizarPeriodo}
          />

    </AppShell>
  );
}


export function DialogPeriodo({
  aberto,
  valor,
  onChange,
  onEdit,
  onClose,
  onSubmit,
  onCancel
}: {
  aberto: boolean;
  valor: typeof periodoVazio;
  onChange: (valor: typeof periodoVazio) => void;
  onEdit: () => void;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      <div className="glass w-full max-w-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold">Nova Período</h2>
        <p className="text-sm text-mut mt-1">Registe ou atualize o período.</p>
          <form
              onSubmit={onSubmit}
              className="grid gap-4 mt-5"
            >
              <div className="grid grid-cols-1">
                
                <input
                  required
                  value={valor.name}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      name: event.target.value,
                    })
                  }
                  placeholder="Nome do período"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>

               <div className="grid grid-cols-2 gap-3">
                
                <input
                  required
                  type="time"
                  value={valor.start_time}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      start_time: event.target.value,
                    })
                  }
                  placeholder="entrada"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
                <input
                  required
                  type="time"
                  value={valor.end_time}
                  onChange={(event) =>
                    onChange({
                      ...valor,
                      end_time: event.target.value,
                    })
                  }
                  placeholder="saída"
                  className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10"
                />
              </div>
              <div className="grid grid-cols-1 ">
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
              <option value="">Estado</option>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
              </select>
              </div>
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
                  Guardar
                </button>
              </div>
            </form>
      </div>
    </div>
  );
}