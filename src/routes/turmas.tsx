import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  anoLetivo,
  maxNotaDaTurma,
} from "@/lib/school-data";
import { TurmaForm, Turma } from "@/types/classroom.ds";

import {
  DialogFooter,
} from "@/components/ui/dialog";

import { getClassrooms, postClassRoom, putClassRoom, transformTurmaFormToTurmaAPI } from "@/api/classrooms";
import { getSchoolLevels } from "@/api/schoollevel";
import { SchoolLevel } from "@/types/schoollevel.ds";
import { Period } from "@/types/period.ds";
import { getPeriods } from "@/api/periods";
import { Room } from "@/types/room.ds";
import { getRooms } from "@/api/rooms";

const turmaVazia:TurmaForm = {
    id: 0,
    name:"",
    school_level_id:0,
    period_id:0,
    room_id:0
}

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
  const [edicaoAberta, setEdicaoAberta] = useState(false);
  
  // Loading essential data .......................
  const { data: turmas = [], isLoading,isError,error } = useQuery<Turma[]>({
    queryKey: ["classrooms"],
    queryFn: async () => {
      return await getClassrooms();
    },
  });

  const { data: niveis = [] } = useQuery<SchoolLevel[]>({
  queryKey: ["school-levels"],
  queryFn: async () => {
    return await getSchoolLevels();
  },
});

  const { data: periodos = [] } = useQuery<Period[]>({
  queryKey: ["periods"],
  queryFn: async () => {
    return await getPeriods();
  },
});

  const { data: salas = [] } = useQuery<Room[]>({
  queryKey: ["rooms"],
  queryFn: async () => {
    return await getRooms();
  },
});
// end Loading essential data .......

  async function adicionarAtualizarTurma(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

        if(edicaoAberta){
              await putClassRoom(novaTurma)
              setEdicaoAberta(false)
            }else{
              const result = await postClassRoom(novaTurma);
            }
    
        setNovaTurma(turmaVazia)
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
              key={t.id}
              className="glass clip p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px]  tracking-[0.15em] text-mut">
                   Período: {t.periodo}
                  </p>

                  <h2 className="text-xl font-semibold mt-1">
                    {t.nome}
                  </h2>
                </div>

                <div className="flex gap-3 ">
                <span className="text-[11px] px-2 py-1 rounded-full bg-surface ring-1 ring-white/10 text-mut">
                 Sala: {t.sala}
                </span>
                <button
                    type="button"
                    onClick={()=>{
                      setFormularioAberto(true)
                      setEdicaoAberta(true)
                      setNovaTurma(transformTurmaFormToTurmaAPI(t))
                    }}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Editar
                  </button>
                </div>
              </div>

              <p className="text-sm text-mut mt-3">
                Diretor(a): {t.diretor}
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-mut">
                    Capacidade
                  </p>

                  <p className="text-lg font-semibold">
                    {t.capacidade}
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

     <DialogTurma
      aberto={formularioAberto}
      valor={novaTurma}
      onChange={setNovaTurma}
      niveis={niveis}
      salas={salas}
      periodos={periodos}
      onEdit={() => setEdicaoAberta(true)}
      onCancel={()=>{
          setFormularioAberto(false)
          setEdicaoAberta(false)
          setNovaTurma(turmaVazia)
      
      }}
      onClose={() =>{
        if(edicaoAberta){
          setEdicaoAberta(false)
          setNovaTurma(turmaVazia)
        }
        setFormularioAberto(false)
      } }
      onSubmit={adicionarAtualizarTurma}
    /> 

    </AppShell>
  );
}

 export function DialogTurma({
   aberto,
   valor,
   niveis,
   periodos,
   salas,
   onChange,
   onEdit,
   onClose,
   onSubmit,
   onCancel
 }: {
   aberto: boolean;
   valor: typeof turmaVazia;
   niveis: SchoolLevel[],
   periodos: Period[],
   salas: Room[],
   onChange: (valor: typeof turmaVazia) => void;
   onEdit: () => void;
   onClose: () => void;
   onCancel: () => void;
   onSubmit: (event: FormEvent<HTMLFormElement>) => void;
 }) {
  


   if (!aberto) return null;

   return (
     <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
       <div className="glass w-full max-w-lg rounded-xl p-6">
         <h2 className="text-lg font-semibold">Nova Turma</h2>
         <p className="text-sm text-mut mt-2">Registe a nova turma.</p>
                     <form
             onSubmit={onSubmit}
             className="grid gap-4"
           >
             <div className="grid grid-cols-2 gap-2 mt-2">
              
               <div className="grid gap-2">
                 <label
                 htmlFor="nome-turma"
                 className="text-sm font-medium"
               >
                 Classe
               </label>
               <select
                 id="classe-turma"
                 required
                 value={valor.school_level_id}
                 onChange={(event) =>
                   onChange({
                     ...valor,
                     school_level_id: parseInt(event.target.value) || 0,
                   })
                 }
                 className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
               >
                 {niveis.map((classe) => (
                   <option
                     key={classe.id}
                     value={classe.id}
                   >
                     {classe.nome}
                   </option>
                 ))}
               </select>
               </div>
               <div className="grid gap-2">
                 <label
                 htmlFor="sala-turma"
                 className="text-sm font-medium"
               >
                 Sala
               </label>

               <select
                 id="sala-turma"
                 required
                 value={valor.room_id}
                 onChange={(event) =>
                   onChange({
                     ...valor,
                     room_id: parseInt(event.target.value) || 0,
                   })
                 }
                 className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
               >
                 {salas.map((sala) => (
                   <option
                     key={sala.id}
                     value={sala.id}
                   >
                     {sala.nome}
                   </option>
                 ))}
               </select>
               </div>
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
                   value={valor.name}
                   onChange={(event) =>
                     onChange({
                       ...valor,
                       name:
                         event.target.value.toUpperCase()
                     })
                   }
                   className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                   placeholder="Ex.: A"
                 />
               </div>

               <div className="grid gap-2">

                 <label
                 htmlFor="periodo-turma"
                 className="text-sm font-medium"
               >
                 Período
               </label>

               <select
                 id="periodo-turma"
                 required
                 value={valor.period_id}
                 onChange={(event) =>
                   onChange({
                     ...valor,
                     period_id: parseInt(event.target.value) || 0,
                   })
                 }
                 className="bg-surface rounded-md px-3 py-2 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
               >
                 {periodos.map((periodo) => (
                   <option
                     key={periodo.id}
                     value={periodo.id}
                   >
                     {periodo.nome}
                   </option>
                 ))}
               </select>
               </div>
             </div>
                    
             <DialogFooter>
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
                 Salvar
               </button>
             </DialogFooter>
           </form>
       </div>
     </div>
   );
 }


