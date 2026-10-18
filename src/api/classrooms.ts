import { api } from "./client";
import { Turma, TurmaApi, TurmaForm } from "@/types/classroom.ds";

  const transformTurmaAPIToTurma = (turma: TurmaApi): Turma => ({
    id: turma.id,
    nome: turma.academic_year_id ==1 ? `Ini - ${turma.name}`:  `${(turma.academic_year_id-1)} - ${turma.name}`,
    diretor: turma.teacher?.name || null,
    alunos: turma.capacity,
    sala: turma.room,
    letra: turma.name,
    schoolLevelId: turma.school_level_id,
    classe: turma.school_level,
  });



export const getClassrooms = async (): Promise<Turma[]> => {
  const response = await api.get<TurmaApi[]>("/classrooms");
  return response.data.map(transformTurmaAPIToTurma);
};


export const postClassRoom = async (
  classroomForm: Pick<TurmaForm, "letra" | "sala" | "alunos" | "classe" | "schoolLevelId">,
): Promise<Turma> => {
  const classroom = {
    name: classroomForm.letra,
    room: classroomForm.sala,
    capacity: classroomForm.alunos,
    school_level_id: classroomForm.schoolLevelId,
  };

  const response = await api.post<TurmaApi>("/classrooms", { classroom });
  const novaTurma: Turma = transformTurmaAPIToTurma(response.data);

  return novaTurma;
};
  
export const putClassRoom = async (classData: Turma): Promise<Turma> => {
  const response = await api.put<TurmaApi>(`/classrooms/${classData.id}`, { classData });
  const turmaAtualizada: Turma = transformTurmaAPIToTurma(response.data);
  return turmaAtualizada;
};

export const deleteClassRoom = async (classData: Turma): Promise<Turma> => {
  const response = await api.delete<TurmaApi>(`/classrooms/${classData.id}`);
  const turmaAtualizada: Turma = transformTurmaAPIToTurma(response.data);
  return turmaAtualizada;
};
