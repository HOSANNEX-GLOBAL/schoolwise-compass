import { Registration, RegistrationAPI } from "@/types/registration.ds";
import { api } from "./client";

export const getRegistrations = async (): Promise<Registration[]> => {
  
  const response = await api.get<RegistrationAPI[]>("/registrations");
  
  return response.data.map((registration) => ({
    id: registration.id,
    candidato: registration.name,
    classePretendida: registration.school_level.name,
    encarregado: registration.guardian,
    contacto: registration.guardian_phone,
    estado: registration.status
  }));
};