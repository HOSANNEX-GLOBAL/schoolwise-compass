import { createFileRoute, Link } from "@tanstack/react-router";

const classroomImage =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2200&q=88";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gestão Académica — Escola" },
      {
        name: "description",
        content:
          "Gestão escolar com foco em aprendizagem, acompanhamento e desenvolvimento de cada estudante.",
      },
      { property: "og:title", content: "Gestão Académica — Escola" },
      {
        property: "og:description",
        content: "Uma comunidade escolar orientada pelo conhecimento e pelo futuro.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-foreground">
      <section
        className="relative isolate flex min-h-screen flex-col justify-between"
        style={{ minHeight: "680px" }}
      >
        <img
          src={classroomImage}
          alt="Estudantes diversos numa sala de aula a aprender em conjunto"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-ink/30 mix-blend-multiply" />

        <header className="relative z-10 flex animate-fade-up items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <Link to="/" className="flex items-center gap-3" aria-label="Gestão Académica">
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-lg font-bold text-ink shadow-2xl">
              GA
            </span>
            <span className="leading-tight">
              <strong className="block text-sm font-semibold tracking-wide text-white">
                Gestão Académica
              </strong>
              <span className="block text-[11px] text-white/65">Conhecimento que transforma</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-white/35 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-accent hover:text-ink"
          >
            Entrar no sistema
          </Link>
        </header>

        <div className="relative z-10 max-w-4xl px-6 pb-20 pt-20 sm:px-10 lg:px-16 lg:pb-28">
          <p className="mb-5 animate-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-accent [animation-delay:120ms]">
            Educação · Disciplina · Futuro
          </p>
          <h1 className="max-w-4xl animate-fade-up text-4xl font-semibold leading-[1.05] tracking-tight text-white [animation-delay:220ms] sm:text-6xl lg:text-8xl">
            Formamos hoje as pessoas que vão construir o amanhã.
          </h1>
          <p className="mt-7 max-w-2xl animate-fade-up text-base leading-7 text-white/78 [animation-delay:340ms] sm:text-lg">
            Uma escola que acompanha cada percurso com responsabilidade, valoriza o esforço e abre
            espaço para que cada estudante descubra o seu próprio caminho.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:460ms]">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 rounded-md bg-accent px-5 py-3 text-sm font-bold text-ink shadow-xl transition-transform hover:-translate-y-0.5"
            >
              Entrar no sistema
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-sm text-white/65">
              Uma comunidade. Um propósito. Muitas possibilidades.
            </span>
          </div>
        </div>

        <div className="relative z-10 grid animate-fade-up grid-cols-1 gap-6 border-t border-white/20 px-6 py-6 [animation-delay:600ms] sm:grid-cols-3 sm:px-10 lg:px-16">
          <div>
            <p className="text-sm font-semibold text-white">Aprendizagem com propósito</p>
            <p className="mt-1 text-xs leading-5 text-white/60">
              Conhecimento aplicado à vida e à comunidade.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Acompanhamento próximo</p>
            <p className="mt-1 text-xs leading-5 text-white/60">
              Cada resultado conta uma história que merece atenção.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Excelência com humanidade</p>
            <p className="mt-1 text-xs leading-5 text-white/60">
              Rigor académico, respeito e confiança no futuro.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 bg-white px-6 py-16 text-ink sm:px-10 lg:grid-cols-[1fr_1.4fr] lg:px-16 lg:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
            O nosso compromisso
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
            Educar é preparar o pensamento para agir com responsabilidade.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <p className="text-base leading-7 text-ink/70">
            A escola é um lugar de descoberta, diálogo e construção. Aqui, o desempenho é
            acompanhado com seriedade, mas nunca separado da pessoa que aprende.
          </p>
          <p className="text-base leading-7 text-ink/70">
            A nossa gestão aproxima famílias, professores e direção para que as decisões sejam
            claras e cada estudante tenha condições de avançar.
          </p>
        </div>
      </section>
    </main>
  );
}
