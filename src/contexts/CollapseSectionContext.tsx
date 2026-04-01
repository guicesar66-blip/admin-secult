import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CollapseSectionState {
  isSectionOpen: (key: string) => boolean;
  toggleSection: (key: string) => void;
}

const CollapseSectionContext = createContext<CollapseSectionState | null>(null);

export function CollapseSectionProvider({ children }: { children: ReactNode }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isSectionOpen = useCallback(
    (key: string) => openSections[key] ?? false,
    [openSections]
  );

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <CollapseSectionContext.Provider value={{ isSectionOpen, toggleSection }}>
      {children}
    </CollapseSectionContext.Provider>
  );
}

export function useCollapseSection() {
  const ctx = useContext(CollapseSectionContext);
  if (!ctx) throw new Error("useCollapseSection must be inside CollapseSectionProvider");
  return ctx;
}
