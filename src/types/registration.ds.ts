import { SchoolLevelAPI } from "./schoollevel.ds";

export type RegistrationAPI = {
  id: number;
  bi: string;
  created_at: string;
  date_of_birth: string;
  genus: string;
  guardian: string;
  guardian_phone: string;
  name: string;
  school_level_id: number;
  status: null | string;
  address: string;
  updated_at: string;
  school_level: SchoolLevelAPI;
};

export type Registration = {
  id: number;
  bi: string;
  dataNascimento: string;
  genero: string;
  candidato: string;
  schoolLevelId: number;
  classePretendida: string;
  encarregado: string;
  contacto: string;
  endereco: string;
  estado: null | string;
}

export type RegistrationForm = {
  id: number | null;
  name: string;
  date_of_birth: string;
  genus: string;
  bi: string;
  guardian: string;
  address: string;
  guardian_phone: string;
  school_level_id: number;
}

export const RegistrationStatus = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2
} as const;

export type RegistrationStatusUpdateForm = {
    id: number;
    status: number;
}


   
