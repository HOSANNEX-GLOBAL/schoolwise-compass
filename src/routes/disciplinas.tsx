import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { disciplinas as disciplinasIniciais, type Disciplina } from "@/lib/school-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DISCIPLINAS_STORAGE_KEY = "schoolwise:disciplinas:v1";
const disciplinaVazia = { nome: "", cargaHoraria: "", professor: "", aprovacao: "0" };

export const Route = createFileRoute("/disciplinas")({
  head: () => ({
    meta: [
      { title: "Gestão de Disciplinas — Gestão Académica" },
      {
        name: "description",
        content: "Disciplinas com carga horária, professor responsável e taxa de aprovação.",
      },
      { property: "og:title", content: "Gestão de Disciplinas — Gestão Académica" },
      { property: "og:description", content: "Plano curricular e desempenho por disciplina." },
    ],
  }),
  component: DisciplinasPage,
});

function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaDisciplina, setNovaDisciplina] = useState(disciplinaVazia);

  useEffect(() => {
    const guardadas = window.localStorage.getItem(DISCIPLINAS_STORAGE_KEY);
    if (guardadas) setDisciplinas(JSON.parse(guardadas) as Disciplina[]);
  }, []);

  function adicionarDisciplina(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nome = novaDisciplina.nome.trim();
    const iniciais = nome
      .split(/\s+/)
      .map((palavra) => palavra.replace(/[^A-Za-zÀ-ÿ]/g, "").charAt(0))
      .filter(Boolean)
      .join("")
      .toUpperCase();
    const codigoBase =
      iniciais ||
      nome
        .replace(/[^A-Za-zÀ-ÿ]/g, "")
        .slice(0, 3)
        .toUpperCase();
    let codigo = codigoBase;
    let sufixo = 2;
    while (disciplinas.some((disciplina) => disciplina.codigo === codigo)) {
      codigo = `${codigoBase}${sufixo}`;
      sufixo += 1;
    }

    const lista = [
      ...disciplinas,
      {
        nome,
        codigo,
        cargaHoraria: Number(novaDisciplina.cargaHoraria),
        professor: novaDisciplina.professor.trim(),
        aprovacao: Number(novaDisciplina.aprovacao),
      },
    ];
    setDisciplinas(lista);
    window.localStorage.setItem(DISCIPLINAS_STORAGE_KEY, JSON.stringify(lista));
    setNovaDisciplina(disciplinaVazia);
    setFormularioAberto(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gestão académica"
        title="Disciplinas"
        action={
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground text-sm font-semibold py-2 px-3 rounded-md ring-1 ring-accent/40"
          >
            + Nova disciplina
          </button>
        }
      />

      <section className="px-8">
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-170">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-mut border-b border-line">
                  <th className="text-left font-medium py-2.5 px-5">Código</th>
                  <th className="text-left font-medium py-2.5">Disciplina</th>
                  <th className="text-left font-medium py-2.5">Carga semanal</th>
                  <th className="text-left font-medium py-2.5">Professor responsável</th>
                  <th className="text-left font-medium py-2.5 pr-5">Aprovação</th>
                </tr>
              </thead>
              <tbody className="text-mut">
                {disciplinas.map((d) => (
                  <tr
                    key={d.codigo}
                    className="border-b border-line/60 last:border-0 hover:bg-surface"
                  >
                    <td className="py-2.5 px-5 font-medium text-brand">{d.codigo}</td>
                    <td className="py-2.5 text-foreground">{d.nome}</td>
                    <td className="py-2.5">{d.cargaHoraria} h</td>
                    <td className="py-2.5">{d.professor}</td>
                    <td className="py-2.5 pr-5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-28 rounded-full bg-surface-strong">
                          <div
                            className={`h-full rounded-full ${d.aprovacao >= 75 ? "bg-pass" : "bg-warn"}`}
                            style={{ width: `${d.aprovacao}%` }}
                          />
                        </div>
                        <span className="text-xs">{d.aprovacao}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Dialog open={formularioAberto} onOpenChange={setFormularioAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova disciplina</DialogTitle>
            <DialogDescription>Adicione uma disciplina ao plano curricular.</DialogDescription>
          </DialogHeader>
          <form onSubmit={adicionarDisciplina} className="grid gap-4">
            {(
              [
                ["nome", "Nome", "text"],
                ["professor", "Professor responsável", "text"],
                ["cargaHoraria", "Carga semanal (horas)", "number"],
                ["aprovacao", "Aprovação inicial (%)", "number"],
              ] as const
            ).map(([campo, rotulo, tipo]) => (
              <label key={campo} className="grid gap-2 text-sm font-medium">
                {rotulo}
                <input
                  required
                  type={tipo}
                  min={campo === "cargaHoraria" ? 1 : campo === "aprovacao" ? 0 : undefined}
                  max={campo === "aprovacao" ? 100 : undefined}
                  value={novaDisciplina[campo]}
                  onChange={(event) =>
                    setNovaDisciplina({ ...novaDisciplina, [campo]: event.target.value })
                  }
                  className="bg-surface rounded-md px-3 py-2 text-sm font-normal ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </label>
            ))}
            <p className="text-xs text-mut">
              O código será gerado automaticamente com base nas iniciais da disciplina.
            </p>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setFormularioAberto(false)}
                className="text-sm px-3 py-2 rounded-md ring-1 ring-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 rounded-md"
              >
                Adicionar disciplina
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
