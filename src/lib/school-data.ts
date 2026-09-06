export type Estado = "Aprovado" | "Reprovado" | "Recurso";

export type Aluno = {
  numero: string;
  nome: string;
  turma: string;
  encarregado: string;
  notas: { t1: number; t2: number; t3: number };
};

export const anoLetivo = "2024/25";

export const alunos: Aluno[] = [
  { numero: "2024-0187", nome: "António F. Neto", turma: "10.º A", encarregado: "Fernando Neto", notas: { t1: 15, t2: 17, t3: 14 } },
  { numero: "2024-0192", nome: "Carla M. Vieira", turma: "10.º B", encarregado: "Manuela Vieira", notas: { t1: 9, t2: 11, t3: 10 } },
  { numero: "2024-0203", nome: "Domingos A. Neto", turma: "10.º A", encarregado: "Aida Neto", notas: { t1: 7, t2: 8, t3: 6 } },
  { numero: "2024-0211", nome: "Beatriz L. Sousa", turma: "11.º C", encarregado: "Luís Sousa", notas: { t1: 18, t2: 19, t3: 16 } },
  { numero: "2024-0219", nome: "Elsa P. Cardoso", turma: "11.º C", encarregado: "Paula Cardoso", notas: { t1: 14, t2: 13, t3: 15 } },
  { numero: "2024-0224", nome: "Joaquim K. Bento", turma: "12.º A", encarregado: "Kiala Bento", notas: { t1: 12, t2: 10, t3: 13 } },
  { numero: "2024-0231", nome: "Lúcia N. Fernandes", turma: "12.º A", encarregado: "Nelson Fernandes", notas: { t1: 16, t2: 15, t3: 17 } },
  { numero: "2024-0240", nome: "Miguel S. Baptista", turma: "10.º B", encarregado: "Sara Baptista", notas: { t1: 8, t2: 9, t3: 11 } },
  { numero: "2024-0246", nome: "Isabel R. Kiala", turma: "11.º B", encarregado: "Rosa Kiala", notas: { t1: 13, t2: 14, t3: 12 } },
  { numero: "2024-0252", nome: "Pedro M. dos Santos", turma: "11.º B", encarregado: "Marta dos Santos", notas: { t1: 11, t2: 12, t3: 9 } },
];

export function media(n: { t1: number; t2: number; t3: number }): number {
  return Math.round(((n.t1 + n.t2 + n.t3) / 3) * 10) / 10;
}

export function estado(m: number): Estado {
  if (m >= 12) return "Aprovado";
  if (m >= 9.5) return "Recurso";
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
  { nome: "10.º A", ciclo: "2.º ciclo", diretor: "Prof. Almeida Cunha", alunos: 34, sala: "B-12", mediaTurma: 13.4 },
  { nome: "10.º B", ciclo: "2.º ciclo", diretor: "Prof.ª Rita Lemos", alunos: 31, sala: "B-14", mediaTurma: 11.8 },
  { nome: "11.º B", ciclo: "2.º ciclo", diretor: "Prof. Ivo Cardoso", alunos: 29, sala: "C-03", mediaTurma: 12.9 },
  { nome: "11.º C", ciclo: "2.º ciclo", diretor: "Prof.ª Sónia Matos", alunos: 30, sala: "C-05", mediaTurma: 15.1 },
  { nome: "12.º A", ciclo: "3.º ciclo", diretor: "Prof. Hélder Pinto", alunos: 27, sala: "A-01", mediaTurma: 14.2 },
  { nome: "12.º B", ciclo: "3.º ciclo", diretor: "Prof.ª Ângela Dias", alunos: 26, sala: "A-04", mediaTurma: 13.0 },
];

export type Disciplina = {
  nome: string;
  codigo: string;
  cargaHoraria: number;
  professor: string;
  aprovacao: number;
};

export const disciplinas: Disciplina[] = [
  { nome: "Matemática", codigo: "MAT", cargaHoraria: 6, professor: "Prof. Almeida Cunha", aprovacao: 78 },
  { nome: "Língua Portuguesa", codigo: "LPO", cargaHoraria: 5, professor: "Prof.ª Rita Lemos", aprovacao: 85 },
  { nome: "Ciências Naturais", codigo: "CNA", cargaHoraria: 4, professor: "Prof. Ivo Cardoso", aprovacao: 81 },
  { nome: "História", codigo: "HIS", cargaHoraria: 3, professor: "Prof.ª Sónia Matos", aprovacao: 72 },
  { nome: "Geografia", codigo: "GEO", cargaHoraria: 3, professor: "Prof. Hélder Pinto", aprovacao: 88 },
  { nome: "Física", codigo: "FIS", cargaHoraria: 4, professor: "Prof.ª Ângela Dias", aprovacao: 69 },
  { nome: "Química", codigo: "QUI", cargaHoraria: 4, professor: "Prof. Adão Muanza", aprovacao: 74 },
  { nome: "Inglês", codigo: "ING", cargaHoraria: 3, professor: "Prof.ª Cátia Rosário", aprovacao: 90 },
];

export type Professor = {
  nome: string;
  disciplina: string;
  turmas: string[];
  contacto: string;
  situacao: "Efetivo" | "Contratado";
};

export const professores: Professor[] = [
  { nome: "Almeida Cunha", disciplina: "Matemática", turmas: ["10.º A", "12.º A"], contacto: "a.cunha@escola.ao", situacao: "Efetivo" },
  { nome: "Rita Lemos", disciplina: "Língua Portuguesa", turmas: ["10.º B", "11.º B"], contacto: "r.lemos@escola.ao", situacao: "Efetivo" },
  { nome: "Ivo Cardoso", disciplina: "Ciências Naturais", turmas: ["11.º B"], contacto: "i.cardoso@escola.ao", situacao: "Contratado" },
  { nome: "Sónia Matos", disciplina: "História", turmas: ["11.º C", "12.º B"], contacto: "s.matos@escola.ao", situacao: "Efetivo" },
  { nome: "Hélder Pinto", disciplina: "Geografia", turmas: ["12.º A"], contacto: "h.pinto@escola.ao", situacao: "Contratado" },
  { nome: "Ângela Dias", disciplina: "Física", turmas: ["12.º B", "11.º C"], contacto: "a.dias@escola.ao", situacao: "Efetivo" },
  { nome: "Adão Muanza", disciplina: "Química", turmas: ["11.º B", "12.º A"], contacto: "a.muanza@escola.ao", situacao: "Contratado" },
  { nome: "Cátia Rosário", disciplina: "Inglês", turmas: ["10.º A", "10.º B"], contacto: "c.rosario@escola.ao", situacao: "Efetivo" },
];

export type Documento = {
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
};

export const documentos: Documento[] = [
  { titulo: "Boletins", descricao: "Boletim individual por aluno e trimestre.", icone: "📄", cor: "text-brand" },
  { titulo: "Mini pautas", descricao: "Pauta simplificada por turma e disciplina.", icone: "📊", cor: "text-cool" },
  { titulo: "Certificados", descricao: "Certificado de conclusão do ciclo de estudos.", icone: "🏆", cor: "text-accent" },
  { titulo: "Declarações", descricao: "Declaração de matrícula e frequência escolar.", icone: "📜", cor: "text-pass" },
  { titulo: "Pautas trimestrais", descricao: "Pauta oficial de notas por trimestre.", icone: "🗂️", cor: "text-brand" },
  { titulo: "Pautas finais", descricao: "Pauta final com aproveitamento anual.", icone: "🧾", cor: "text-warn" },
];

export type Alteracao = {
  data: string;
  utilizador: string;
  descricao: string;
};

export const historico: Alteracao[] = [
  { data: "12/03 · 09:14", utilizador: "Prof. Almeida Cunha", descricao: "Nota de Matemática alterada de 11 para 13 · António F. Neto" },
  { data: "11/03 · 16:02", utilizador: "Teresa M. Cabral", descricao: "Lançamento em massa do 2.º trimestre · 10.º B" },
  { data: "10/03 · 11:47", utilizador: "Prof.ª Rita Lemos", descricao: "Recurso registado em Língua Portuguesa · Carla M. Vieira" },
  { data: "08/03 · 08:30", utilizador: "Prof. Ivo Cardoso", descricao: "Correcção de lançamento em Ciências Naturais · 11.º B" },
];
