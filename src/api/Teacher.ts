import { Teacher, TeacherApi } from "@/types/teacher.ds";
import { api } from "./client";

export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get<TeacherApi[]>("/teachers");

  return response.data.map((teacher) => ({
    // id: teacher.id,
    nome: teacher.name,
    disciplina: "Disciplina", // Placeholder, replace with actual mapping if available
    turmas: [], // Placeholder, replace with actual mapping if available
    contacto: teacher.contact,
    situacao: teacher.employment_status === "contracted" ? "Contratado" : "Efetivo",
    userId: teacher.user_id,
  }));
};
