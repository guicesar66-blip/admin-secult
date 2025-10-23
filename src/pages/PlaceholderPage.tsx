import { DashboardLayout } from "@/components/DashboardLayout";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
