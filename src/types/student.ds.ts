export type AlunoAPI = {
  id: number;
  address: string;
  bi: string;
  created_at: string;
  date_of_birth: string;
  gender: number;
  guardian: string;
  guardian_phone: string;
  name: string;
  student_number: string;
  updated_at: string;
  overall_average: number;
  classrooms: [
    {
      id: number;
      name: string;
    },
  ];
};

export type Aluno = {
  numero: string;
  nome: string;
  turma: string;
  encarregado: string;
  encarregado_tel: string;
  bi?: string;
  endereco?: string;
  dataNascimento?: string;
  media?: number;
};
