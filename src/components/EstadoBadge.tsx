import type { Estado, EstadoAcademico } from "@/lib/school-data";

const styles: Record<EstadoAcademico, string> = {
  Aprovado: "bg-pass/15 text-pass ring-pass/30",
  Recurso: "bg-warning/15 text-warning ring-warning/30",
  Reprovado: "bg-fail/15 text-fail ring-fail/30",
};

export function EstadoBadge({ estado }: { estado: EstadoAcademico }) {
  return (
    <span className={`text-[11px] px-2 py-1 rounded-full ring-1 ${styles[estado]}`}>{estado}</span>
  );
}
