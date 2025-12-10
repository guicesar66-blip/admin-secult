import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Users,
  LineChart,
  Target,
  Building2,
  LogOut,
  Menu,
  Settings,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";
import logoHorizontalDefault from "@/assets/logo-horizontal.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Painel", path: "/dashboard" },
  { icon: LineChart, label: "Análise Financeira", path: "/analise-financeira" },
  { icon: MapPin, label: "Análise Territorial", path: "/analise-territorial" },
  { icon: Users, label: "Análise de Pessoas", path: "/analise-artistas" },
  { icon: Target, label: "Oportunidades", path: "/oportunidades" },
  { icon: GraduationCap, label: "Incubações", path: "/incubacoes" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { config } = useWhiteLabel();
  
  const logoHorizontal = config.logoHorizontal || logoHorizontalDefault;
  const clientName = config.clientName || 'Cenna';

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <img 
                src={logoHorizontal} 
                alt={clientName} 
                className="h-8 w-auto"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center text-white font-bold text-xs">
              {clientName.charAt(0).toUpperCase()}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-3">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path!}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-smooth",
                location.pathname === item.path
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}

          <button
            className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
            onClick={() => (window.location.href = "/")}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-card">
          <div className="flex items-center gap-3">
            <img 
              src={logoHorizontal} 
              alt={clientName} 
              className="h-10 w-auto"
            />
            <div className="border-l border-border pl-3">
              <p className="text-xs text-muted-foreground font-medium">
                Painel Administrativo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">João Silva</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
