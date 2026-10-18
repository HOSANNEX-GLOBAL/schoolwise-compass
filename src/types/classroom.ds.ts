export type Turma = {
  id: number;
  nome: string;
  diretor: string | null;
  alunos: number;
  sala: string;
  letra: string;
  schoolLevelId: number;
  classe: string;
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
  school_level_id: number;
  school_level: string,
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
    letra: string;
    sala: string;
    alunos: number;
    schoolLevelId: number;
    classe: string;
}
  
