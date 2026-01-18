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
import logoMainDefault from "@/assets/logo-caran.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { config } = useWhiteLabel();
  
  const logoMain = config.logoMain || logoMainDefault;
  const clientName = config.clientName || 'Cenna';

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Check if user is admin
          checkAdminRole(session.user.id);
        } else {
          setCheckingAuth(false);
        }
      }
    );

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
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking role:', error);
        setCheckingAuth(false);
        return;
      }

      if (data?.role === 'admin') {
        navigate("/dashboard", { replace: true });
      } else {
        // User exists but is not admin
        toast.error("Acesso restrito a administradores");
        await supabase.auth.signOut();
        setCheckingAuth(false);
      }
    } catch (error) {
      console.error('Error:', error);
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
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError || !roleData) {
          toast.error("Erro ao verificar permissões do usuário");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        if (roleData.role !== 'admin') {
          toast.error("Acesso restrito a administradores. Esta área é apenas para gestores da plataforma.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <img 
              src={logoMain} 
              alt={clientName} 
              className="h-48 w-auto"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Plataforma de Gestão Cultural
          </p>
        </div>

        {/* Card de Login */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-elevated">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">
            Acesso Administrativo
          </h2>

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
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
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
              <a
                href="#"
                className="text-sm text-primary hover:text-primary-hover transition-smooth"
              >
                Esqueci minha senha
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>© 2025 {clientName}</span>
          <span>•</span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>
    </div>
  );
}
