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
import { Blocks } from "lucide-react";

// API helper inside component file
async function createProject(data: { name: string; description: string }) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    if (res.status === 400 && result.fieldErrors) {
      return { fieldErrors: result.fieldErrors };
    }
    return { error: result.error || "Failed to create Project" };
  }
  return { message: "Project created successfully" };
}

export function CreateProject({
  onProjectChangedRefresh,
}: {
  onProjectChangedRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
      const result = await createProject(formData);

      if ("fieldErrors" in result) {
        setErrors(result.fieldErrors as typeof errors);
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Project created");
      onProjectChangedRefresh(); // fetch the latest data after insert

      // Reset form
      setFormData({
        name: "",
        description: "",
      });

      setOpen(false); // Close dialog
    } catch (error) {
      console.error("Error creating Project:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="font-bold gap-2">
            <Blocks /> Create New Project
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project</AlertDialogTitle>
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
                  <p
                    id={`${field}-error`}
                    className="text-sm text-red-600 mt-1"
                  >
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit">Submit</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
