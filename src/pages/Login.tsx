import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logoMain from "@/assets/logo-main.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - em produção, validar credenciais
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <img 
              src={logoMain} 
              alt="Cenna" 
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
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Lembrar-me
              </label>
            </div>

            <Button type="submit" className="w-full">
              Entrar
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
          <span>© 2025 Cenna</span>
          <span>•</span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>
    </div>
  );
}
