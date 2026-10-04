import { Registration, RegistrationAPI, RegistrationForm, RegistrationStatusUpdateForm } from "@/types/registration.ds";
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
    endereco: registration.address,
    estado: registration.status,
  }));
};

export const postRegistrations = async (registration: Omit<RegistrationForm, "id">): Promise<void> => {
  const response = await api.post<RegistrationAPI>("/registrations", { registration });

  console.log("Nova inscrição:", response.data);
  
  
  // return {
  //   id: response.data.id,
  //   candidato: response.data.name,
  //   classePretendida: response.data.school_level.name,
  //   encarregado: response.data.guardian,
  //   contacto: response.data.guardian_phone,
  //   estado: response.data.status
  // };
};
  
export const putRegistrations = async (registration: RegistrationForm): Promise<void> => {
  const response = await api.put<RegistrationAPI>(`/registrations/${registration.id}`, { registration });

  console.log("Update inscrição:", response.data);
  
  
  // return {
  //   id: response.data.id,
  //   candidato: response.data.name,
  //   classePretendida: response.data.school_level.name,
  //   encarregado: response.data.guardian,
  //   contacto: response.data.guardian_phone,
  //   estado: response.data.status
  // };
};

export const updateRegistrationStatus = async (registration: RegistrationStatusUpdateForm): Promise<void> => {
  const response = await api.post<RegistrationAPI>(`/registrations/${registration.id}/update_status`, { registration });

  // return {
  //   id: response.data.id,
  //   candidato: response.data.name,
  //   classePretendida: response.data.school_level.name,
  //   encarregado: response.data.guardian,
  //   contacto: response.data.guardian_phone,
  //   estado: response.data.status
  // };
};
