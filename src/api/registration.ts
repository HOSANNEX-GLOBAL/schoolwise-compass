import { Registration, RegistrationAPI } from "@/types/registration.ds";
import { api } from "./client";

export const getRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get<RegistrationAPI[]>("/registrations");

  return response.data.map((registration) => ({
    id: registration.id,
    bi: registration.bi,
    candidato: registration.name,
    dataNascimento: registration.date_of_birth,
    classePretendida: registration.school_level.name,
    encarregado: registration.guardian,
    contacto: registration.guardian_phone,
    endereco: "",
    estado: registration.status,
  }));
};
