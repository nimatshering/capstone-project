"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CircleCheckBig, Loader2, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteProjectBtnProps {
  projectId: string;
  onProjectChangedRefresh?: () => void;
}

// Inline deleteProject function
async function deleteProject(id: string) {
  const res = await fetch("/api/projects", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { error: result.error || "Failed to delete Project" };
  }

  return { message: result.message };
}

export default function DeleteProjectBtn({
  projectId,
  onProjectChangedRefresh,
}: DeleteProjectBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteProject(projectId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Project deleted", {
        icon: <CircleCheckBig className="text-green-700 size-5" />,
        className: "bg-red-100 border border-red-300 text-red-800",
      });

      setIsOpen(false);

      if (onProjectChangedRefresh) {
        onProjectChangedRefresh();
      } else {
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Delete Project">
          <Trash2Icon className="size-6 text-red-600" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleDelete}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
