import { ChevronDown } from "lucide-react";
import { useCollapseSection } from "@/contexts/CollapseSectionContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CollapsibleSectionProps {
  sectionKey: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function CollapsibleSection({ sectionKey, title, children, icon }: CollapsibleSectionProps) {
  const { isSectionOpen, toggleSection } = useCollapseSection();
  const isOpen = isSectionOpen(sectionKey);

  return (
    <div className="space-y-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center gap-2 w-full text-left group"
      >
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200 ml-1",
            isOpen && "rotate-180"
          )}
        />
        <span className="flex-1 border-t border-border/50 ml-2" />
      </button>
      {isOpen && children}
    </div>
  );
}
