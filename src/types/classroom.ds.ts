export type Turma = {
  id: number;
  nome: string;
  diretor: string | null;
  alunos: number;
  sala: string;
  mediaTurma: number | null;
};

export type TurmaApi = {
  id: number;
  academic_year_id: number;
  capacity: number;
  created_at: string;
  name: string;
  room: string;
  teacher_id: number | null;
  updated_at: string;
  academic_year: {
    id: number;
    name: string;
  };
  class_average: number | null;
   teacher: {
     id: number;
     name: string;   
 } | null;
};

// teacher_id: number;
export type TurmaForm = {
    id?: number;
    name: string;
    room: string;
    capacity: number;
    school_level_id: number;
}
