import { api } from "./client";
import { Turma, TurmaApi, TurmaForm } from "@/types/classroom.ds";

  const transformTurmaAPIToTurma = (turma: TurmaApi): Turma => ({
    id: turma.id,
    nome: turma.name, // turma.academic_year_id ==1 ? `Ini - ${turma.name}`:  `${(turma.academic_year_id-1)} - ${turma.name}`,
    diretor: turma.teacher?.name || null,
    capacidade: turma.room.capacity,
    periodo_id:turma.period_id,
    sala_id: turma.room_id,
    nivel_id:turma.school_level_id,
    sala: turma.room.name,
    mediaTurma: turma.class_average??0,
    periodo: turma.period.name
});

export const transformTurmaFormToTurmaAPI = (
  turma: Turma
): TurmaForm => ({
    id: turma.id,
    name: turma.nome,
    school_level_id: turma.nivel_id,
    period_id: turma.periodo_id,
    room_id:turma.sala_id
});
 
export const getClassrooms = async (): Promise<Turma[]> => {
  const response = await api.get<TurmaApi[]>("/classrooms");
  return response.data.map(transformTurmaAPIToTurma);
};


export const postClassRoom = async (classroomFormData: TurmaForm): Promise<Turma> => {
  const {id,...classroom}=classroomFormData
  const response = await api.post<TurmaApi>("/classrooms", { classroom });
  const novaTurma: Turma = transformTurmaAPIToTurma(response.data);
    console.log("after post", response)

  return novaTurma;
};
  
export const putClassRoom = async (classroom: TurmaForm): Promise<Turma> => {
  const response = await api.put<TurmaApi>(`/classrooms/${classroom.id}`, { classroom });
  console.log("after update", response)
  const turmaAtualizada: Turma = transformTurmaAPIToTurma(response.data);
  return turmaAtualizada;
};

export const deleteClassRoom = async (classData: Turma): Promise<Turma> => {
  const response = await api.delete<TurmaApi>(`/classrooms/${classData.id}`);
  const turmaAtualizada: Turma = transformTurmaAPIToTurma(response.data);
  return turmaAtualizada;
};


