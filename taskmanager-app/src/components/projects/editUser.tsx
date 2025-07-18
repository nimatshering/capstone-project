"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenBoxIcon } from "lucide-react";

type EditProjectFormProps = {
  project: {
    id: string;
    name: string;
    description: string;
  };
  onProjectChangedRefresh?: () => void;
};

async function updateProject(data: {
  id: string;
  name: string;
  description: string;
}) {
  const res = await fetch("/api/projects", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 400 && result.fieldErrors) {
      return { fieldErrors: result.fieldErrors };
    }
    return { error: result.error || "Failed to update Project" };
  }
  return { message: "Project updated successfully" };
}

//Edit Projectform
export function EditProjectForm({
  project,
  onProjectChangedRefresh,
}: EditProjectFormProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const result = await updateProject({ id: project.id, ...formData });

      if ("fieldErrors" in result) {
        setErrors(result.fieldErrors);
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Project updated");
      setOpen(false);

      if (onProjectChangedRefresh) {
        onProjectChangedRefresh(); // refresh data
      }
    } catch (error) {
      console.error("Error updating Project:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Delete Project">
          <PenBoxIcon className="size-6 text-gray-700" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Project</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(["name", "description"] as const).map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === "name"
                  ? "name"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                placeholder={`Enter ${field}`}
                type={field === "description" ? "description" : "text"}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                aria-invalid={!!errors[field]}
                aria-describedby={`${field}-error`}
              />
              {errors[field] && (
                <p id={`${field}-error`} className="text-sm text-red-600 mt-1">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit">Update</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
