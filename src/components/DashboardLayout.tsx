import { ReactNode, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Users,
  LineChart,
  Target,
  LogOut,
  Menu,
  Settings,
  GraduationCap,
  UserCog,
  Coins,
  Plus,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Store,
  Wallet,
  UsersRound,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";
import { NotificationBell } from "@/components/NotificationBell";
import logoHorizontalDefault from "@/assets/406583ac-4e2e-42fa-b871-ac69fce319d1.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Gestão",
    items: [
      { icon: Target, label: "Projetos", path: "/oportunidades" },
      { icon: Users, label: "Meu Perfil", path: "/perfil" },
    ],
  },
  {
    title: "Oportunidades",
    items: [
      { 
        icon: Store, 
        label: "Oportunidades",
        children: [
          { label: "Explorar", path: "/marketplace" },
          { label: "Meus Investimentos", path: "/investimentos" },
        ]
      },
    ],
  },
  {
    title: "Dados",
    items: [
      { icon: BarChart3, label: "Central de Dados", path: "/dados" },
    ],
  },
  {
    title: "Administração",
    items: [
      { icon: UserCog, label: "Usuários", path: "/usuarios" },
    ],
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Analytics", "Configurações"]);
  const { config } = useWhiteLabel();
  
  const logoHorizontal = config.logoHorizontal || logoHorizontalDefault;
  const clientName = config.clientName || 'Cena';

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path?: string, children?: { path: string }[]) => {
    if (path && location.pathname === path.split('?')[0]) return true;
    if (children) {
      return children.some(child => location.pathname === child.path.split('?')[0]);
    }
    return false;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img 
                src={logoHorizontal} 
                alt={clientName} 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-sidebar-foreground">CENA</span>
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

        <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-2">
              {sidebarOpen && (
                <p className="px-3 py-1 text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-smooth",
                          isPathActive(undefined, item.children)
                            ? "bg-sidebar-primary/50 text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {sidebarOpen && <span>{item.label}</span>}
                        </div>
                      </button>
                      {sidebarOpen && expandedMenus.includes(item.label) && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block rounded-md px-3 py-1.5 text-xs transition-smooth",
                                location.pathname === child.path.split('?')[0]
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-border bg-card px-6 shadow-card">
          <div className="flex items-center gap-4">
            <NotificationBell />
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