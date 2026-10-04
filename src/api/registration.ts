import { Registration, RegistrationAPI, RegistrationForm, RegistrationStatusUpdateForm } from "@/types/registration.ds";
import { api } from "./client";

export const getRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get<RegistrationAPI[]>("/registrations");

  return response.data.map((registration) => ({
    id: registration.id,
    bi: registration.bi,
    candidato: registration.name,
    dataNascimento: registration.date_of_birth,
    genero: registration.genus,
    classePretendida: registration.school_level.name,
    schoolLevelId: registration.school_level.id,
    encarregado: registration.guardian,
    contacto: registration.guardian_phone,
    endereco: registration.address,
    estado: registration.status,
  }));
};

export const postRegistrations = async (registration: Omit<RegistrationForm, "id">): Promise<void> => {
  await api.post<RegistrationAPI>("/registrations", { registration });
};
  
export const putRegistrations = async (registration: RegistrationForm): Promise<void> => {
  await api.put<RegistrationAPI>(`/registrations/${registration.id}`, { registration });
};
  
export const updateRegistrationStatus = async (registration: RegistrationStatusUpdateForm): Promise<void> => {
  await api.post<RegistrationAPI>(`/registrations/${registration.id}/update_status`, { registration });
};
