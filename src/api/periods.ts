import { formatTime } from "@/lib/formatTime";
import { api } from "./client";
import { Period, PeriodAPI } from "@/types/period.ds";

// Transforma os dados da API para o formato usado no frontend
export const transformPeriodAPIToPeriod = (
  period: PeriodAPI
): Period => ({
  id: period.id,
  nome: period.name,
  hora_inicio: formatTime(period.start_time) ,
  hora_fim: formatTime(period.end_time),
  estado: period.status,
  criado_em: period.created_at,
  atualizado_em: period.updated_at,
});

// Transforma os dados do frontend para o formato da API
export const transformPeriodToPeriodAPI = (
  period: Period
): PeriodAPI => ({
  id: period.id,
  name: period.nome,
  start_time: period.hora_inicio,
  end_time: period.hora_fim,
  status: period.estado,
  created_at: period.criado_em,
  updated_at: period.atualizado_em,
});

// Listar períodos
export const getPeriods = async (): Promise<Period[]> => {
  const response = await api.get<PeriodAPI[]>("/periods");

  return response.data.map(transformPeriodAPIToPeriod);
};

// Criar período
export const postPeriod = async (
  periodData: Omit<PeriodAPI, "id" | "created_at" | "updated_at">
): Promise<Period> => {

  const {id,created_at,updated_at,...period}= periodData as PeriodAPI
  
  const response = await api.post<PeriodAPI>("/periods", {
    period,
  });

  return transformPeriodAPIToPeriod(response.data);
};

// Atualizar período
export const putPeriod = async (
  periodData: Omit<PeriodAPI, "created_at" | "updated_at">
): Promise<Period> => {


   const { created_at, updated_at, ...period } = periodData as PeriodAPI;

  const response = await api.put<PeriodAPI>(
    `/periods/${period.id}`,
    { period }
  );

  return transformPeriodAPIToPeriod(response.data);
};

// Eliminar período
export const deletePeriod = async (
  period: Period
): Promise<void> => {
  await api.delete(`/periods/${period.id}`);
};