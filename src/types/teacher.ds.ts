
export type TeacherApi = {
    id: number;
    contact: string;
    created_at: string;
    employment_status: string;
    name: string;
    updated_at: string;
    user_id: string;
}

export type Teacher = {
  nome: string;
  disciplina: string;
  turmas: string[];
  contacto: string;
  situacao: "Efetivo" | "Contratado";
  userId: string;
};