export type Estado = "Aprovado" | "Reprovado" | "Recurso";


export const anoLetivo = "2024/25";

 type Aluno = {
  numero: string;
  nome: string;
  turma: string;
  encarregado: string;
  dataNascimento?: string;
  contactoEncarregado?: string;
  estadoMatricula?: "Ativo" | "Transferido" | "Concluído";
  notas: { t1: number; t2: number; t3: number };
};

export const anoLetivo = "2026-2027";

export const classesEnsinoGeral = [
  "Iniciação",
  "1.ª classe",
  "2.ª classe",
  "3.ª classe",
  "4.ª classe",
  "5.ª classe",
  "6.ª classe",
  "7.ª classe",
  "8.ª classe",
  "9.ª classe",
] as const;

export function maxNotaDaClasse(classe: string): 10 | 20 {
  const numero = Number.parseInt(classe, 10);
  return classe === "Iniciação" || numero <= 5 ? 10 : 20;
}

export function maxNotaDaTurma(turma: string): 10 | 20 {
  return maxNotaDaClasse(turma.replace(/\s+[A-Z]$/, ""));
}

export function normalizarNota(valor: number, turma: string): number {
  const maximo = maxNotaDaTurma(turma);
  const ajustado = maximo === 10 && valor > 10 ? valor / 2 : valor;
  return Math.min(maximo, Math.max(0, ajustado));
}

export function normalizarNotas(notas: Aluno["notas"], turma: string): Aluno["notas"] {
  return {
    t1: normalizarNota(notas.t1, turma),
    t2: normalizarNota(notas.t2, turma),
    t3: normalizarNota(notas.t3, turma),
  };
}

export function cicloDaClasse(classe: string): string {
  const numero = Number.parseInt(classe, 10);
  if (classe === "Iniciação" || numero <= 6) return "Ensino primário";
  return "I ciclo do ensino secundário";
}

export const alunos: Aluno[] = [
  {
    numero: "2026-0187",
    nome: "António F. Neto",
    turma: "1.ª classe A",
    encarregado: "Fernando Neto",
    notas: { t1: 8, t2: 9, t3: 7 },
  },
  {
    numero: "2026-0192",
    nome: "Carla M. Vieira",
    turma: "2.ª classe A",
    encarregado: "Manuela Vieira",
    notas: { t1: 5, t2: 6, t3: 5 },
  },
  {
    numero: "2026-0203",
    nome: "Domingos A. Neto",
    turma: "3.ª classe A",
    encarregado: "Aida Neto",
    notas: { t1: 4, t2: 5, t3: 3 },
  },
  {
    numero: "2026-0211",
    nome: "Beatriz L. Sousa",
    turma: "4.ª classe A",
    encarregado: "Luís Sousa",
    notas: { t1: 9, t2: 10, t3: 8 },
  },
  {
    numero: "2026-0219",
    nome: "Elsa P. Cardoso",
    turma: "5.ª classe A",
    encarregado: "Paula Cardoso",
    notas: { t1: 7, t2: 6, t3: 8 },
  },
  {
    numero: "2026-0224",
    nome: "Joaquim K. Bento",
    turma: "6.ª classe A",
    encarregado: "Kiala Bento",
    notas: { t1: 12, t2: 10, t3: 13 },
  },
  {
    numero: "2026-0231",
    nome: "Lúcia N. Fernandes",
    turma: "7.ª classe A",
    encarregado: "Nelson Fernandes",
    notas: { t1: 16, t2: 15, t3: 17 },
  },
  {
    numero: "2026-0240",
    nome: "Miguel S. Baptista",
    turma: "8.ª classe A",
    encarregado: "Sara Baptista",
    notas: { t1: 8, t2: 9, t3: 11 },
  },
  {
    numero: "2026-0246",
    nome: "Isabel R. Kiala",
    turma: "9.ª classe A",
    encarregado: "Rosa Kiala",
    notas: { t1: 13, t2: 14, t3: 12 },
  },
  {
    numero: "2026-0252",
    nome: "Pedro M. dos Santos",
    turma: "9.ª classe B",
    encarregado: "Marta dos Santos",
    notas: { t1: 11, t2: 12, t3: 9 },
  },
  notas: {
    t1: number;
    t2: number;
    t3: number;
  };
};

export const alunos: Aluno[] = [
  { numero: "2024-0187", nome: "António F. Neto", turma: "10.º A", encarregado: "Fernando Neto", notas: { t1: 15, t2: 17, t3: 14 } },
  { numero: "2024-0192", nome: "Carla M. Vieira", turma: "10.º B", encarregado: "Manuela Vieira", notas: { t1: 9, t2: 11, t3: 10 } },
  { numero: "2024-0203", nome: "Domingos A. Neto", turma: "10.º A", encarregado: "Aida Neto", notas: { t1: 7, t2: 8, t3: 6 } },
  { numero: "2024-0211", nome: "Beatriz L. Sousa", turma: "11.º C", encarregado: "Luís Sousa", notas: { t1: 18, t2: 19, t3: 16 } },
  { numero: "2024-0219", nome: "Elsa P. Cardoso", turma: "11.º C", encarregado: "Paula Cardoso", notas: { t1: 14, t2: 13, t3: 15 } },
  { numero: "2024-0224", nome: "Joaquim K. Bento", turma: "12.º A", encarregado: "Kiala Bento", notas: { t1: 12, t2: 10, t3:13 } },
  { numero: "2024-0231", nome: "Lúcia N. Fernandes", turma: "12.º A", encarregado: "Nelson Fernandes", notas: { t1: 16, t2: 15, t3: 17 } },
  { numero: "2024-0240", nome: "Miguel S. Baptista", turma: "10.º B", encarregado: "Sara Baptista", notas: { t1: 8, t2: 9, t3: 11 } },
  { numero: "2024-0246", nome: "Isabel R. Kiala", turma: "11.º B", encarregado: "Rosa Kiala", notas: { t1: 13, t2: 14, t3: 12 } },
  { numero: "2024-0252", nome: "Pedro M. dos Santos", turma: "11.º B", encarregado: "Marta dos Santos", notas: { t1: 11, t2: 12, t3: 9 } },
];


export function media(n: { t1: number; t2: number; t3: number }): number {
  return Math.round(((n.t1 + n.t2 + n.t3) / 3) * 10) / 10;
}

export function estado(m: number, maxNota: 10 | 20): Estado {
  const notaMinima = maxNota === 10 ? 6 : 11;
  if (m >= notaMinima) return "Aprovado";
  return "Reprovado";
}

export function fmt(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

export type Turma = {
  nome: string;
  ciclo: string;
  diretor: string;
  alunos: number;
  sala: string;
  mediaTurma: number;
};

export const turmas: Turma[] = [
  {
    nome: "1.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Almeida Cunha",
    alunos: 34,
    sala: "B-12",
    mediaTurma: 6.7,
  },
  {
    nome: "2.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Rita Lemos",
    alunos: 31,
    sala: "B-14",
    mediaTurma: 5.9,
  },
  {
    nome: "3.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Ivo Cardoso",
    alunos: 29,
    sala: "C-03",
    mediaTurma: 6.5,
  },
  {
    nome: "4.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Sónia Matos",
    alunos: 30,
    sala: "C-05",
    mediaTurma: 7.6,
  },
  {
    nome: "5.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Hélder Pinto",
    alunos: 27,
    sala: "A-01",
    mediaTurma: 7.1,
  },
  {
    nome: "6.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Ângela Dias",
    alunos: 26,
    sala: "A-04",
    mediaTurma: 13.0,
  },
  {
    nome: "7.ª classe A",
    ciclo: "I ciclo do ensino secundário",
    diretor: "Prof. Adão Muanza",
    alunos: 28,
    sala: "C-08",
    mediaTurma: 12.6,
  },
  {
    nome: "8.ª classe A",
    ciclo: "I ciclo do ensino secundário",
    diretor: "Prof.ª Cátia Rosário",
    alunos: 30,
    sala: "C-10",
    mediaTurma: 13.2,
  },
  {
    nome: "9.ª classe A",
    ciclo: "I ciclo do ensino secundário",
    diretor: "Prof. Almeida Cunha",
    alunos: 25,
    sala: "C-12",
    mediaTurma: 14.0,
  },
];

 type Disciplina = {
  nome: string;
  codigo: string;
  cargaHoraria: number;
  professor: string;
  aprovacao: number;
};

export const disciplinas: Disciplina[] = [
  {
    nome: "Matemática",
    codigo: "MAT",
    cargaHoraria: 6,
    professor: "Prof. Almeida Cunha",
    aprovacao: 78,
  },
  {
    nome: "Língua Portuguesa",
    codigo: "LPO",
    cargaHoraria: 5,
    professor: "Prof.ª Rita Lemos",
    aprovacao: 85,
  },
  {
    nome: "Ciências Naturais",
    codigo: "CNA",
    cargaHoraria: 4,
    professor: "Prof. Ivo Cardoso",
    aprovacao: 81,
  },
  {
    nome: "História",
    codigo: "HIS",
    cargaHoraria: 3,
    professor: "Prof.ª Sónia Matos",
    aprovacao: 72,
  },
  {
    nome: "Geografia",
    codigo: "GEO",
    cargaHoraria: 3,
    professor: "Prof. Hélder Pinto",
    aprovacao: 88,
  },
  {
    nome: "Física",
    codigo: "FIS",
    cargaHoraria: 4,
    professor: "Prof.ª Ângela Dias",
    aprovacao: 69,
  },
  {
    nome: "Química",
    codigo: "QUI",
    cargaHoraria: 4,
    professor: "Prof. Adão Muanza",
    aprovacao: 74,
  },
  {
    nome: "Inglês",
    codigo: "ING",
    cargaHoraria: 3,
    professor: "Prof.ª Cátia Rosário",
    aprovacao: 90,
  },
];

export type Professor = {
  nome: string;
  disciplina: string;
  turmas: string[];
  contacto: string;
  situacao: "Efetivo" | "Contratado";
};

export const professores: Professor[] = [
  {
    nome: "Almeida Cunha",
    disciplina: "Matemática",
    turmas: ["1.ª classe A", "9.ª classe A"],
    contacto: "a.cunha@escola.ao",
    situacao: "Efetivo",
  },
  {
    nome: "Rita Lemos",
    disciplina: "Língua Portuguesa",
    turmas: ["2.ª classe A", "7.ª classe A"],
    contacto: "r.lemos@escola.ao",
    situacao: "Efetivo",
  },
  {
    nome: "Ivo Cardoso",
    disciplina: "Ciências Naturais",
    turmas: ["7.ª classe A"],
    contacto: "i.cardoso@escola.ao",
    situacao: "Contratado",
  },
  {
    nome: "Sónia Matos",
    disciplina: "História",
    turmas: ["4.ª classe A", "8.ª classe A"],
    contacto: "s.matos@escola.ao",
    situacao: "Efetivo",
  },
  {
    nome: "Hélder Pinto",
    disciplina: "Geografia",
    turmas: ["9.ª classe A"],
    contacto: "h.pinto@escola.ao",
    situacao: "Contratado",
  },
  {
    nome: "Ângela Dias",
    disciplina: "Física",
    turmas: ["8.ª classe A", "4.ª classe A"],
    contacto: "a.dias@escola.ao",
    situacao: "Efetivo",
  },
  {
    nome: "Adão Muanza",
    disciplina: "Química",
    turmas: ["7.ª classe A", "9.ª classe A"],
    contacto: "a.muanza@escola.ao",
    situacao: "Contratado",
  },
  {
    nome: "Cátia Rosário",
    disciplina: "Inglês",
    turmas: ["1.ª classe A", "2.ª classe A"],
    contacto: "c.rosario@escola.ao",
    situacao: "Efetivo",
  },
];

export type Documento = {
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
};

export const documentos: Documento[] = [
  {
    titulo: "Boletins",
    descricao: "Boletim individual por aluno e trimestre.",
    icone: "📄",
    cor: "text-brand",
  },
  {
    titulo: "Mini pautas",
    descricao: "Pauta simplificada por turma e disciplina.",
    icone: "📊",
    cor: "text-cool",
  },
  {
    titulo: "Certificados",
    descricao: "Certificado de conclusão do ciclo de estudos.",
    icone: "🏆",
    cor: "text-accent",
  },
  {
    titulo: "Declarações",
    descricao: "Declaração de matrícula e frequência escolar.",
    icone: "📜",
    cor: "text-pass",
  },
  {
    titulo: "Pautas trimestrais",
    descricao: "Pauta oficial de notas por trimestre.",
    icone: "🗂️",
    cor: "text-brand",
  },
  {
    titulo: "Pautas finais",
    descricao: "Pauta final com aproveitamento anual.",
    icone: "🧾",
    cor: "text-warn",
  },
];

export type Alteracao = {
  data: string;
  utilizador: string;
  descricao: string;
};
