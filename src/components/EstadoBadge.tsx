import type { Estado } from "@/lib/school-data";

const styles: Record<Estado, string> = {
  Aprovado: "bg-pass/15 text-pass ring-pass/30",
  Recurso: "bg-warn/15 text-warn ring-warn/30",
  Reprovado: "bg-fail/15 text-fail ring-fail/30",
};

export function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`text-[11px] px-2 py-1 rounded-full ring-1 ${styles[estado]}`}>{estado}</span>
  );
}
