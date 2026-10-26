export type RoomAPI = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  room_type: string;
  capacity: number | null;
  building: string | null;
  floor: string | null;
  status: string;
  observation: string | null;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: number;
  nome: string;
  codigo: string;
  descricao: string | null;
  tipo: string;
  capacidade: number | null;
  edificio: string | null;
  piso: string | null;
  estado: string;
  observacoes: string | null;
  criado_em: string,
  atualizado_em:string
};



