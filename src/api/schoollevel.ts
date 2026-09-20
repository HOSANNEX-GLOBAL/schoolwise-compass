import { SchoolLevel, SchoolLevelAPI } from "@/types/schoollevel.ds";
import { api } from "./client";

export const getSchoolLevels = async (): Promise<SchoolLevel[]> => {
  
  const response = await api.get<SchoolLevelAPI[]>("/school_levels");
  
  return response.data.map((nivel) => ({
    id: nivel.id,
    nome: nivel.name,
    codigo: nivel.code,
  }));
};