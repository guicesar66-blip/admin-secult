import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WhiteLabelConfig {
  clientName: string;
  logoMain: string | null;
  logoHorizontal: string | null;
  primaryColor: string; // HSL format: "0 66% 48%"
  secondaryColor: string;
  sidebarBackground: string;
}

const defaultConfig: WhiteLabelConfig = {
  clientName: 'Cenna',
  logoMain: null,
  logoHorizontal: null,
  primaryColor: '0 58% 35%',
  secondaryColor: '232 36% 45%',
  sidebarBackground: '232 36% 18%',
};

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  updateConfig: (newConfig: Partial<WhiteLabelConfig>) => void;
  resetConfig: () => void;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export function WhiteLabelProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WhiteLabelConfig>(() => {
    const saved = localStorage.getItem('whitelabel-config');
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  });

  // Apply CSS variables whenever config changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--primary-hover', adjustLightness(config.primaryColor, -6));
    root.style.setProperty('--ring', config.primaryColor);
    root.style.setProperty('--sidebar-primary', config.primaryColor);
    root.style.setProperty('--sidebar-ring', config.primaryColor);
    
    // Secondary colors
    root.style.setProperty('--secondary', config.secondaryColor);
    root.style.setProperty('--secondary-hover', adjustLightness(config.secondaryColor, -7));
    
    // Sidebar colors
    root.style.setProperty('--sidebar-background', config.sidebarBackground);
    root.style.setProperty('--sidebar-accent', adjustLightness(config.sidebarBackground, 6));
    root.style.setProperty('--sidebar-border', adjustLightness(config.sidebarBackground, 8));
    
    // Update gradient
    root.style.setProperty(
      '--gradient-primary', 
      `linear-gradient(135deg, hsl(${config.primaryColor}), hsl(${config.secondaryColor}))`
    );
  }, [config]);

  const updateConfig = (newConfig: Partial<WhiteLabelConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('whitelabel-config', JSON.stringify(updated));
      return updated;
    });
  };

  const resetConfig = () => {
    localStorage.removeItem('whitelabel-config');
    setConfig(defaultConfig);
  };

  return (
    <WhiteLabelContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }
  return context;
}

// Helper to adjust HSL lightness
function adjustLightness(hsl: string, amount: number): string {
  const parts = hsl.split(' ');
  if (parts.length >= 3) {
    const lightness = parseFloat(parts[2]);
    parts[2] = `${Math.max(0, Math.min(100, lightness + amount))}%`;
    return parts.join(' ');
  }
  return hsl;
}
