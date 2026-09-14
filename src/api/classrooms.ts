import { Aluno, AlunoAPI } from "@/types/student.ds";
import { api } from "./client";
import { Turma, TurmaApi } from "@/types/classroom.ds";

export const getClassrooms = async (): Promise<Turma[]> => {
  
  const response = await api.get<TurmaApi[]>("/classrooms");
  
  return response.data.map((turma) => ({
    nome: turma.name,
    ciclo: turma.cycle,
    diretor: turma.teacher.name, // Assuming teacher_id is the director's ID
    alunos: turma.capacity,
    sala: turma.room,
    mediaTurma: turma.class_average,
  }));
};