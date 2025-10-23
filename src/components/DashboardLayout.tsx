import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Users,
  LineChart,
  Target,
  Building2,
  ClipboardCheck,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  {
    icon: TrendingUp,
    label: "Análises",
    submenu: [
      { icon: LineChart, label: "Financeira", path: "/analise-financeira" },
      { icon: MapPin, label: "Territorial", path: "/analise-territorial" },
      { icon: Users, label: "Artistas", path: "/analise-artistas" },
      { icon: TrendingUp, label: "Carreiras", path: "/analise-carreiras" },
    ],
  },
  {
    icon: Building2,
    label: "Gestão",
    submenu: [
      { icon: Target, label: "Oportunidades", path: "/oportunidades" },
      { icon: Building2, label: "Incubações", path: "/incubacoes" },
      { icon: ClipboardCheck, label: "Aprovações", path: "/aprovacoes" },
    ],
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-sidebar-foreground">
              SECULT
            </h2>
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
            <div key={item.label}>
              {item.submenu ? (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70">
                    <item.icon className="h-4 w-4" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-smooth",
                            location.pathname === subItem.path
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
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
              )}
            </div>
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
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Computadores fazem Arte
            </h1>
            <p className="text-xs text-muted-foreground">
              Painel Administrativo SECULT
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">João Silva</p>
              <p className="text-xs text-muted-foreground">SECULT</p>
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
