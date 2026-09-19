export type UserRole = "admin" | "secretario" | "dp" | "professor";

export type SessionUser = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: UserRole;
  disciplina?: string;
  turmas?: string[];
  ativo: boolean;
  criadoPor?: string;
};

export const USERS_STORAGE_KEY = "schoolwise:users:v1";
export const SESSION_STORAGE_KEY = "schoolwise:session:v1";

export const DEFAULT_USERS: SessionUser[] = [
  {
    id: "admin-01",
    nome: "Ana Costa",
    email: "admin@escola.ao",
    senha: "admin123",
    cargo: "admin",
    ativo: true,
    criadoPor: "sistema",
  },
  {
    id: "secretaria-01",
    nome: "Teresa Cabral",
    email: "secretaria@escola.ao",
    senha: "secretaria123",
    cargo: "secretario",
    ativo: true,
    criadoPor: "admin",
  },
  {
    id: "dp-01",
    nome: "João Mendes",
    email: "dp@escola.ao",
    senha: "dp123",
    cargo: "dp",
    ativo: true,
    criadoPor: "admin",
  },
  {
    id: "prof-01",
    nome: "Almeida Cunha",
    email: "almeida@escola.ao",
    senha: "prof123",
    cargo: "professor",
    disciplina: "Matemática",
    turmas: ["1.ª classe A", "9.ª classe A"],
    ativo: true,
    criadoPor: "admin",
  },
];

export function getRoleLabel(cargo: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Administração / Pedagógica",
    secretario: "Secretário(a)",
    dp: "Direção Pedagógica",
    professor: "Professor(a)",
  };

  return labels[cargo];
}

export function getDefaultUsers(): SessionUser[] {
  return DEFAULT_USERS.map((user) => ({ ...user, turmas: user.turmas ? [...user.turmas] : [] }));
}

export function readUsers(): SessionUser[] {
  if (typeof window === "undefined") {
    return getDefaultUsers();
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(getDefaultUsers()));
    return getDefaultUsers();
  }

  try {
    const parsed = JSON.parse(raw) as SessionUser[];
    return parsed.length > 0 ? parsed : getDefaultUsers();
  } catch {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(getDefaultUsers()));
    return getDefaultUsers();
  }
}

export function saveUsers(users: SessionUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function saveSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function canAccessPath(cargo: UserRole, path: string): boolean {
  const paths: Record<UserRole, string[]> = {
    admin: [
      "/dashboard",
      "/alunos",
      "/turmas",
      "/disciplinas",
      "/professores",
      "/inscricao",
      "/matricula",
      "/notas",
      "/documentos",
      "/estatisticas",
      "/cadastro",
      "/usuarios",
    ],
    secretario: [
      "/dashboard",
      "/alunos",
      "/turmas",
      "/disciplinas",
      "/inscricao",
      "/matricula",
      "/documentos",
      "/estatisticas",
    ],
    dp: [
      "/dashboard",
      "/alunos",
      "/turmas",
      "/disciplinas",
      "/professores",
      "/inscricao",
      "/matricula",
      "/documentos",
      "/estatisticas",
      "/cadastro",
      "/usuarios",
    ],
    professor: ["/dashboard", "/notas", "/documentos"],
  };

  return paths[cargo].includes(path);
}

export function getVisibleRoutes(cargo: UserRole) {
  const map: Record<UserRole, { to: string; label: string }[]> = {
    admin: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/alunos", label: "Alunos" },
      { to: "/turmas", label: "Turmas" },
      { to: "/disciplinas", label: "Disciplinas" },
      { to: "/professores", label: "Professores" },
      { to: "/inscricao", label: "Inscrições" },
      { to: "/matricula", label: "Matrículas" },
      { to: "/notas", label: "Notas" },
      { to: "/documentos", label: "Documentos" },
      { to: "/estatisticas", label: "Estatísticas" },
      { to: "/usuarios", label: "Usuários" },
    ],
    secretario: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/alunos", label: "Alunos" },
      { to: "/turmas", label: "Turmas" },
      { to: "/disciplinas", label: "Disciplinas" },
      { to: "/inscricao", label: "Inscrições" },
      { to: "/matricula", label: "Matrículas" },
      { to: "/documentos", label: "Documentos" },
      { to: "/estatisticas", label: "Estatísticas" },
    ],
    dp: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/alunos", label: "Alunos" },
      { to: "/turmas", label: "Turmas" },
      { to: "/disciplinas", label: "Disciplinas" },
      { to: "/professores", label: "Professores" },
      { to: "/inscricao", label: "Inscrições" },
      { to: "/matricula", label: "Matrículas" },
      { to: "/documentos", label: "Documentos" },
      { to: "/estatisticas", label: "Estatísticas" },
      { to: "/usuarios", label: "Usuários" },
    ],
    professor: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/notas", label: "Notas" },
      { to: "/documentos", label: "Documentos" },
    ],
  };

  return map[cargo];
}

export function authenticate(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === normalizedEmail && entry.senha === password && entry.ativo,
  );

  if (!user) {
    return { ok: false as const, message: "Credenciais inválidas ou utilizador inativo." };
  }

  return { ok: true as const, user };
}

export function authorizeUserRegistration(identifier: string, accessKey: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = readUsers().find(
    (entry) =>
      (entry.email.toLowerCase() === normalizedIdentifier ||
        entry.nome.toLowerCase() === normalizedIdentifier) &&
      (entry.cargo === "admin" || entry.cargo === "dp") &&
      entry.senha === accessKey &&
      entry.ativo,
  );

  return Boolean(user);
}

export function isTeacherAuthorizedFor(
  user: SessionUser | null,
  disciplina?: string,
  turma?: string,
) {
  if (!user || user.cargo !== "professor") return true;
  if (!disciplina || !turma) return true;

  const disciplinaOk = !user.disciplina || user.disciplina === disciplina;
  const turmaOk = !user.turmas?.length || user.turmas.includes(turma);

  return disciplinaOk && turmaOk;
}
