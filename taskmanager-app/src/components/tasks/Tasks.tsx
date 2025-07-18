"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlarmClockCheckIcon, Loader2 } from "lucide-react";

import DeleteTask from "./deleteTask";
import { EditTask } from "./editTask";
import { CreateTask } from "./createTask";
import TaskStatus from "./statusColours";

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: "At-Risk" | "In-progress" | "Done";
  dueAt: string;
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const fetchTasks = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to fetch tasks");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of tasks");
      }

      setTasks(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleTaskRefresh = () => {
    fetchTasks();
  };

  if (!projectId)
    return (
      <p className="text-center mt-10 text-red-500">No project selected.</p>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;

  return (
    <>
      <div className="my-2">
        <CreateTask
          projectId={projectId}
          onTaskChangedRefresh={handleTaskRefresh}
        />
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="my-2">
          <div className="flex flex-col md:flex-row w-full bg-gray-50 rounded-lg shadow overflow-hidden">
            {/* Icon */}
            <div className="flex items-center justify-center w-full md:w-32 h-12 md:h-auto bg-sky-100 shrink-0">
              <AlarmClockCheckIcon
                width={60}
                height={60}
                className="text-gray-700"
              />
            </div>

            <div className="flex-1 px-4 py-3">
              {/* Task content */}
              <div className="flex gap-6">
                <div className="w-60">
                  <div className="mb-2">
                    <span className="font-semibold">Task:</span> {task.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Due Date :</span>
                    {new Date(task.dueAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="py-2 rounded text-white w-full text-center">
                    <TaskStatus status={task.status} />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-gray-600 font-bold py-2">Remarks</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center justify-end p-4 border-t md:border-t-0 md:border-l border-slate-100">
              <EditTask task={task} onTaskChangedRefresh={handleTaskRefresh} />
              <DeleteTask
                taskId={task.id}
                onTaskChangedRefresh={handleTaskRefresh}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
