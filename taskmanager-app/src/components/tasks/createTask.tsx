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
import { LayoutList } from "lucide-react";

interface CreateTaskProps {
  projectId: string;
  onTaskChangedRefresh: () => void;
}

async function postTask(data: {
  projectId: string;
  name: string;
  description: string;
  status: string;
  dueAt: string;
}) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 400 && result.fieldErrors) {
      return { fieldErrors: result.fieldErrors };
    }
    return { error: result.error || "Failed to create Task" };
  }
  return { message: "Task created successfully" };
}

export function CreateTask({
  projectId,
  onTaskChangedRefresh,
}: CreateTaskProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "todo", // <-- added status here
    dueAt: "",
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
      const result = await postTask({
        projectId,
        ...formData,
      });

      if ("fieldErrors" in result) {
        setErrors(result.fieldErrors as typeof errors);
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Task created");
      onTaskChangedRefresh();
      setFormData({ name: "", description: "", status: "todo", dueAt: "" }); // reset including status
      setOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <LayoutList />
            Create Task
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Task</AlertDialogTitle>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="projectId" value={projectId} />

            <div>
              <Label htmlFor="name" className="py-2">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter task name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
                required
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="py-2">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                aria-invalid={!!errors.description}
                aria-describedby="description-error"
                className="border px-3 py-2 w-full rounded"
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="py-2">
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                aria-invalid={!!errors.status}
                aria-describedby="status-error"
                className="border px-3 py-2 w-full rounded"
              >
                <option value="In-progress">In Progress</option>
                <option value="At-Risk">At Risk</option>
                <option value="Done">Done</option>
              </select>
              {errors.status && (
                <p id="status-error" className="text-sm text-red-600 mt-1">
                  {errors.status}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dueAt" className="py-2">
                Due Date
              </Label>
              <Input
                id="dueAt"
                type="date"
                value={formData.dueAt}
                onChange={(e) => handleChange("dueAt", e.target.value)}
                aria-invalid={!!errors.dueAt}
                aria-describedby="dueAt-error"
              />
              {errors.dueAt && (
                <p id="dueAt-error" className="text-sm text-red-600 mt-1">
                  {errors.dueAt}
                </p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit">Create</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
