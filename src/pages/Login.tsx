import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import logoMainDefault from "@/assets/979d359e-6e6c-4a17-8c2f-14c392780648.png";

function PEArcs() {
  return (
    <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-80 h-80 opacity-20">
      <path d="M 0 400 A 350 350 0 0 1 350 50" fill="none" stroke="#C41200" strokeWidth="8" />
      <path d="M 0 400 A 290 290 0 0 1 290 110" fill="none" stroke="#FFBD0C" strokeWidth="8" />
      <path d="M 0 400 A 230 230 0 0 1 230 170" fill="none" stroke="#00A84F" strokeWidth="8" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { config } = useWhiteLabel();

  const logoMain = config.logoMain || logoMainDefault;
  const clientName = config.clientName || "Cenna";

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        setCheckingAuth(false);
        return;
      }

      if (data?.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Acesso restrito a administradores");
        await supabase.auth.signOut();
        setCheckingAuth(false);
      }
    } catch {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu email antes de fazer login");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }
      if (data.user) {
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (roleError || !roleData) {
          toast.error("Erro ao verificar permissões do usuário");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        if (roleData.role !== "admin") {
          toast.error("Acesso restrito a administradores.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard", { replace: true });
      }
    } catch {
      toast.error("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left — Visual / Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(160deg, #1A2A4A 0%, #3567C4 60%, #C41200 100%)" }}
      >
        <PEArcs />
        <div className="relative z-10 text-center px-12">
          <h1 className="text-4xl font-bold text-white mb-4">Das Raízes aos Dados</h1>
          <p className="text-white/75 text-lg max-w-md mx-auto">
            Plataforma de Gestão Cultural do Estado de Pernambuco
          </p>
        </div>
        {/* CENA logo decoration */}
        <img src={cenaLogo} alt="CENA" className="absolute top-12 right-12 w-24 h-auto opacity-40" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-card p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-6 flex justify-center">
              <img src={logoMain} alt={clientName} className="h-48 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">Plataforma de Gestão Cultural</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-elevated">
            <h2 className="mb-6 text-xl font-semibold text-foreground">​Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={loading} />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:text-primary-hover transition-smooth">
                  Esqueci minha senha
                </a>
              </div>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>© 2025 {clientName}</span>
            <span>•</span>
            <span>Todos os direitos reservados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
