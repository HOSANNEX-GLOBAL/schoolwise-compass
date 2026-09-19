export type Turma = {
  nome: string;
  ciclo: string;
  diretor: string;
  alunos: number;
  sala: string;
  mediaTurma: number;
};

export type TurmaApi = {
  id: number;
  academic_year_id: number;
  capacity: number;
  created_at: string;
  cycle: string;
  name: string;
  room: string;
  teacher_id: number;
  updated_at: string;
  class_average: number;
  academic_year: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;   
};
};
