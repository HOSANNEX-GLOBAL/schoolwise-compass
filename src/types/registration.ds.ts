import { SchoolLevelAPI } from "./schoollevel.ds";

export type RegistrationAPI = {
  id: number;
  bi: string;
  created_at: string;
  date_of_birth: string;
  guardian: string;
  guardian_phone: string;
  name: string;
  school_level_id: number;
  status: null | string;
  updated_at: string;
  school_level: SchoolLevelAPI;
};

export type Registration = {
  id: number;
  bi: string;
  candidato: string;
  dataNascimento: string;
  classePretendida: string;
  encarregado: string;
  contacto: string;
  endereco: string;
  estado: null | string;
};
