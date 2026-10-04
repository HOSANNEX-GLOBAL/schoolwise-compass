import { Registration, RegistrationAPI, RegistrationForm, RegistrationStatusUpdateForm } from "@/types/registration.ds";
import { api } from "./client";

const transformRegistrationAPIToRegistration = (registration: RegistrationAPI): Registration => ({
  id: registration.id,
  bi: registration.bi,
  candidato: registration.name,
  dataNascimento: registration.date_of_birth,
  genero: registration.genus,
  encarregado: registration.guardian,
  contacto: registration.guardian_phone,
  endereco: registration.address,
  classePretendida: registration.school_level.name,
  classId: registration.school_level.id,
  estado: registration.status,
});

export const getRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get<RegistrationAPI[]>("/registrations");

  return response.data.map(transformRegistrationAPIToRegistration);
};

export const postRegistrations = async (registration: Omit<RegistrationForm, "id">): Promise<Registration> => {
  const response = await api.post<RegistrationAPI>("/registrations", { registration });
  const novaInscricao: Registration = transformRegistrationAPIToRegistration(response.data);
  return novaInscricao;
};
  
export const putRegistrations = async (registration: RegistrationForm): Promise<Registration> => {
  const response = await api.put<RegistrationAPI>(`/registrations/${registration.id}`, { registration });
  const inscricaoAtualizada: Registration = transformRegistrationAPIToRegistration(response.data);
  return inscricaoAtualizada;
};

export const updateRegistrationStatus = async (registration: RegistrationStatusUpdateForm): Promise<Registration> => {
  const response = await api.post<RegistrationAPI>(`/registrations/${registration.id}/update_status`, { registration });
  const inscricaoAtualizada: Registration = transformRegistrationAPIToRegistration(response.data);
  return inscricaoAtualizada;
};
