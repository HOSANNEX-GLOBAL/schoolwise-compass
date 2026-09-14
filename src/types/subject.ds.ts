
export type SubjectApi = { 
id: number,
code: string,
created_at: string,
name: string,
updated_at: string,
weekly_hours: number
}


export type Subject = {
  id: number;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  professor: string;
  aprovacao: number;
};
