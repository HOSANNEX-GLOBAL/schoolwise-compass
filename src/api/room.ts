import { api } from "./client";
import { Room, RoomApi, RoomForm } from "@/types/room.ds";

  const transformRoomAPIToRoom = (room: RoomApi): Room => ({
    id: room.id,
    sala: room.sala,

  });



export const getRoom = async (): Promise<Room[]> => {
  const response = await api.get<RoomApi[]>("/room");
  return response.data.map(transformRoomAPIToRoom);
};


export const postRoom = async (
  RoomForm: Pick<RoomForm,  "sala">,
): Promise<Room> => {
  const room = {
    sala: RoomForm.sala,

  };

  const response = await api.post<RoomApi>("/room", { room });
  const novaSala: Room = transformRoomAPIToRoom(response.data);

  return novaSala;
};
  
export const putRoom = async (classData: Room): Promise<Room> => {
  const response = await api.put<RoomApi>(`/room/${classData.id}`, { classData });
  const salaAtualizada: Room = transformRoomAPIToRoom(response.data);
  return salaAtualizada;
};

export const deleteRoom = async (classData: Room): Promise<Room> => {
  const response = await api.delete<RoomApi>(`/room/${classData.id}`);
  const salaAtualizada: Room = transformRoomAPIToRoom(response.data);
  return salaAtualizada;
};
