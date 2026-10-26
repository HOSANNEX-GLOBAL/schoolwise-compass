export type Turma = {
  id: number;
  nome: string;
  diretor: string | null;
  capacidade: number;
  sala: string;
  periodo:string;
  periodo_id:number;
  sala_id:number;
  nivel_id:number;
  mediaTurma: number | null;
};

// teacher_id: number;
export type TurmaForm = {
    id: number;
    name: string;
    school_level_id: number;
    period_id: number;
    room_id:number;
}

export type TurmaApi = {
  id: number;
  academic_year_id: number;
  teacher_id: number | null;
  name: string;
  created_at: string;
  updated_at: string;
  school_level_id: number;
  period_id: number;
  room_id: number;
  class_average: number | null;

  academic_year: {
    id: number;
    name: string;
  };

  period: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    status: string;
  };

  room: {
    id: number;
    code: string;
    name: string;
    room_type: string;
    capacity: number;
  };

  teacher: {
    id: number;
    name: string;
  } | null;
};

