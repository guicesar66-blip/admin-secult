import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type FilterEntityType = "produtor" | "projeto" | "espaco" | "deserto";

export interface MapFilter {
  id: string;
  type: FilterEntityType;
  name: string;
  icon: string; // emoji
  /** Extra data for downstream filtering (e.g. municipio, linguagem) */
  meta?: Record<string, string | number>;
}

interface MapFilterContextValue {
  filters: MapFilter[];
  addFilter: (filter: MapFilter) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  hasFilter: (id: string) => boolean;
}

const MapFilterContext = createContext<MapFilterContextValue | null>(null);

export function MapFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MapFilter[]>([]);

  const addFilter = useCallback((filter: MapFilter) => {
    setFilters((prev) => {
      // Don't duplicate
      if (prev.some((f) => f.id === filter.id)) return prev;
      return [...prev, filter];
    });
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFilters = useCallback(() => setFilters([]), []);

  const hasFilter = useCallback(
    (id: string) => filters.some((f) => f.id === id),
    [filters],
  );

  return (
    <MapFilterContext.Provider value={{ filters, addFilter, removeFilter, clearFilters, hasFilter }}>
      {children}
    </MapFilterContext.Provider>
  );
}

export function useMapFilter() {
  const ctx = useContext(MapFilterContext);
  if (!ctx) throw new Error("useMapFilter must be used within MapFilterProvider");
  return ctx;
}
