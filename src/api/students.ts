import { Aluno, AlunoAPI } from "@/types/student.ds";
import { api } from "./client";

export const getStudents = async (): Promise<Aluno[]> => {
  const response = await api.get<AlunoAPI[]>("/students");

  return response.data.map((aluno) => ({
    numero: aluno.student_number,
    nome: aluno.name,
    turma: aluno.classrooms[0]?.name ?? "",
    encarregado: aluno.guardian,
    encarregado_tel: aluno.guardian_phone,
    bi: aluno.bi,
    endereco: aluno.address,
    dataNascimento: aluno.date_of_birth,
    media: aluno.overall_average,
  }));
};
