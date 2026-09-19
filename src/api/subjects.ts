import { api } from "./client";
import { Subject, SubjectApi } from "@/types/subject.ds";

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<SubjectApi[]>("/subjects");
  return response.data.map((subject) => ({
    id: subject.id,
    nome: subject.name,
    codigo: subject.code,
    cargaHoraria: subject.weekly_hours,
    professor: "Teacher",
    aprovacao: 20,
  }));
};
