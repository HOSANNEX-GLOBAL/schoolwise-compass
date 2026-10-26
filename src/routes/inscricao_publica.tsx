import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authenticate, saveSession } from "@/lib/auth";
import { DialogInscricao, inscricaoVazia } from "./inscricao";
import { RegistrationForm } from "@/types/registration.ds";
import { postRegistrations } from "@/api/registration";

export const Route = createFileRoute("/inscricao_publica")({
  head: () => ({
    meta: [
      { title: "Incrição pública" },
      { name: "description", content: "Incrição de qualquer candidato a nossa." },
    ],
  }),
  component: PublicRegistrationPage,
});

function PublicRegistrationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@escola.ao");
  const [senha, setSenha] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novaInscricao, setNovaInscricao] = useState(inscricaoVazia);
  const [edicaoAberta, setEdicaoAberta] = useState(false);

  async function adicionarInscricao(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
  
      const inscricao: RegistrationForm = {
        id: novaInscricao.id,
        name: novaInscricao.nome,
        bi: novaInscricao.bi,
        date_of_birth: novaInscricao.dataNascimento,
        guardian: novaInscricao.encarregado,
        guardian_phone: novaInscricao.contacto,
        address: novaInscricao.endereco,
        school_level_id: parseInt(novaInscricao.classe),
      };
      
  
      if(edicaoAberta){
        setEdicaoAberta(true)
      }else{
        const novaInscricao = await postRegistrations(inscricao);
      }
      
      setNovaInscricao(inscricaoVazia);
      setFormularioAberto(false);
    }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const result = authenticate(email, senha);

    if (!result.ok) {
      toast.error("Acesso bloqueado", {
        description: result.message,
      });
      setSubmitting(false);
      return;
    }

    saveSession(result.user);
    toast.success("Autenticação concluída", {
      description: `Bem-vindo(a), ${result.user.nome}.`,
    });
    navigate({ to: "/dashboard" });
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-ink text-foreground">
                    <DialogInscricao
              aberto={true}
              valor={novaInscricao}
              onChange={setNovaInscricao}
              onCancel={()=>{ navigate({ to: "/" });}}
              onEdit={() => {}}
              onClose={() =>{
                setFormularioAberto(false)
              } }
              onSubmit={adicionarInscricao}
            />
    </div>
  );
}
