import { api } from "./client";
import { Room, RoomAPI } from "@/types/room.ds";

// Transforma os dados da API para o formato usado no frontend
export const transformRoomAPIToRoom = (room: RoomAPI): Room => ({
  id: room.id,
  nome: room.name,
  codigo: room.code,
  descricao: room.description,
  tipo: room.room_type,
  capacidade: room.capacity,
  edificio: room.building,
  piso: room.floor,
  estado: room.status,
  observacoes: room.observation,
  criado_em:room.created_at,
  atualizado_em:room.updated_at
});

export const transformRoomToRoomAPI = (room: Room): RoomAPI => ({
  id: room.id,
  name: room.nome,
  code: room.codigo,
  description: room.descricao,
  room_type: room.tipo,
  capacity: room.capacidade,
  building: room.edificio,
  floor: room.piso,
  status: room.estado,
  observation: room.observacoes,
  created_at:room.criado_em,
  updated_at:room.atualizado_em
});

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get<RoomAPI[]>("/rooms");

  return response.data.map(transformRoomAPIToRoom);
};

// Criar sala
export const postRoom = async (
  roomForm: Omit<RoomAPI, "id" | "created_at" | "updated_at">
): Promise<Room> => {
  const response = await api.post<RoomAPI>("/rooms", {
    room: roomForm,
  });

  return transformRoomAPIToRoom(response.data);
};

// Atualizar sala
export const putRoom = async (
  roomData: Omit<RoomAPI,"created_at" | "updated_at">
): Promise<Room> => {
    const { created_at, updated_at, ...room } = roomData as RoomAPI;
    
  const response = await api.put<RoomAPI>(`/rooms/${room.id}`, {
    room,
  });

  return transformRoomAPIToRoom(response.data);
};

// Eliminar sala
export const deleteRoom = async (
  room: Room
): Promise<void> => {
  await api.delete(`/rooms/${room.id}`);
};