import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectTitle,
  onConfirm,
  isDeleting,
}: DeleteProjectDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === projectTitle;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Projeto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto
              e todos os dados associados (candidaturas, histórico, etc).
            </p>
            <div className="space-y-2 pt-2">
              <Label htmlFor="confirm-delete" className="text-foreground font-medium">
                Digite o nome do projeto para confirmar:
              </Label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {projectTitle}
              </p>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite o nome do projeto"
                className="mt-2"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Excluindo..." : "Excluir Projeto"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
