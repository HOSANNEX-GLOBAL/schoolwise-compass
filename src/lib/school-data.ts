export type Estado = "Ativo" | "Transferido" | "Concluido" | "Desistente";
 export type EstadoAcademico = "Aprovado" | "Recurso" | "Reprovado";

 export type Aluno = {
  numero: string;
  nome: string;
  turma: string;
  encarregado: string;
  dataNascimento?: string;
  contactoEncarregado?: string;
  estadoMatricula?: "Ativo" | "Transferido";
  notas: { MAC: number; PP: number; PT: number };
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

export function maxNotaDaClasse(classe: string): 10 | 20{
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

// Calcula automaticamente a Média Trimestral dividindo por 3
export function calcularMediaTrimestral(mac: number, pp: number, pt: number): number {
  const media = (mac + pp + pt) / 3;
  
  return Number(Math.round(media).toFixed(1));
}

export function normalizarNotas(notas: Aluno["notas"], turma: string): Aluno["notas"] & { MT: number } {

  const macNormalizado = normalizarNota(notas.MAC, turma);
  const ppNormalizado = normalizarNota(notas.PP, turma);
  const ptNormalizado = normalizarNota(notas.PT, turma);

  const mtCalculado = calcularMediaTrimestral(macNormalizado, ppNormalizado, ptNormalizado);

  // Devolve as notas tratadas e o cálculo da MT incluído automaticamente
  return {
    MAC: macNormalizado,
    PP: ppNormalizado,
    PT: ptNormalizado,
    MT: mtCalculado,
  };
}

export function cicloDaClasse(classe: string): string {
  const numero = Number.parseInt(classe, 10);
  if (classe === "Iniciação" || numero <= 6) return "Ensino primário";
  return "I ciclo do ensino secundário";
}


export const alunos: Aluno[] = [
  { numero: "2024-0187", nome: "António F. Neto", turma: "10.º A", encarregado: "Fernando Neto",
      notas: { MAC: 10, PP: 12, PT: 14 }
  },
  { numero: "2024-0188", nome: "Beatriz M. Silva", turma: "10.º A", encarregado: "Maria Silva",
      notas: { MAC: 8, PP: 10, PT: 12 }
  }
];

export function media(n: { MAC: number; PP: number; PT: number }): number {
  return Math.round(((n.MAC + n.PP + n.PT ) / 3) * 10) / 10;
}

export function estado(m: number, maxNota: 10 | 20): EstadoAcademico {
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
  diretor: string ;
  alunos: number;
  sala: string;
  // mediaTurma: number;
};

export const turmas: Turma[] = [
  {
    nome: "1.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Almeida Cunha",
    alunos: 34,
    sala: "B-12",
    // mediaTurma: 6.7,
  },
  {
    nome: "2.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Rita Lemos",
    alunos: 31,
    sala: "B-14",
    // mediaTurma: 7.2,
  },
  {
    nome: "3.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Ivo Cardoso",
    alunos: 29,
    sala: "C-03",
    // mediaTurma: 6.5,
  },
  {
    nome: "4.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Sónia Matos",
    alunos: 30,
    sala: "C-05",
    // mediaTurma: 7.6,
  },
  {
    nome: "5.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof. Hélder Pinto",
    alunos: 27,
    sala: "A-01",
    // mediaTurma: 7.1,
  },
  {
    nome: "6.ª classe A",
    ciclo: "Ensino primário",
    diretor: "Prof.ª Ângela Dias",
    alunos: 26,
    sala: "A-04",
    // mediaTurma: 13.0,
  },

];

 export type Disciplina = {
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
