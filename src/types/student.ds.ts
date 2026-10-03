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
<<<<<<< HEAD
  encarregado_tel: string;
  bi?: string;
  endereco?: string;
  dataNascimento?: string;
  media?: number;
};
=======
//   media: number;
//   // notas: { t1: number; t2: number; t3: number };
};
>>>>>>> 1af226cd3c0cf479cb1e2b47994b5c8290cba624
