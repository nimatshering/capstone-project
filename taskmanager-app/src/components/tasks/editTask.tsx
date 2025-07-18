"use client";

import { useState, useEffect } from "react";
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
import { Loader2, PenBoxIcon } from "lucide-react";

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: string;
  dueAt: string;
}

interface EditTaskProps {
  task: Task;
  onTaskChangedRefresh: () => void;
}

async function putTask(data: {
  id: string;
  name: string;
  description: string;
  status: string;
  dueAt: string;
  projectId: string;
}) {
  const res = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 400 && result.fieldErrors) {
      return { fieldErrors: result.fieldErrors };
    }
    return { error: result.error || "Failed to update Task" };
  }
  return { message: "Task updated successfully" };
}

export function EditTask({ task, onTaskChangedRefresh }: EditTaskProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "todo",
    dueAt: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});

  const [loading, setLoading] = useState(false);

  // Initialize formData when task prop changes or dialog opens
  useEffect(() => {
    if (open && task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "todo",
        dueAt: task.dueAt ? task.dueAt.split("T")[0] : "",
      });
      setErrors({});
    }
  }, [open, task]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const result = await putTask({
        id: task.id,
        projectId: task.projectId, // pass projectId from task prop
        ...formData,
      });

      if ("fieldErrors" in result) {
        setErrors(result.fieldErrors as typeof errors);
        setLoading(false);
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success(result.message || "Task updated");
      onTaskChangedRefresh();
      setOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Delete Task">
          <PenBoxIcon className="size-6 text-gray-700" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Task</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="py-2">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
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
            <Button variant="outline" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
