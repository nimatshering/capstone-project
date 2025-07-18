"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Loader2 } from "lucide-react";
import { CreateProject } from "./createProject";
import { EditProjectForm } from "./editUser";
import DeleteProjectBtn from "./deleteProject";

interface Project {
  id: string;
  name: string;
  description: string;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectRefresh = () => {
    fetchProjects();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;

  return (
    <>
      <div className="my-6">
        <CreateProject onProjectChangedRefresh={handleProjectRefresh} />
      </div>

      {projects.map((project) => (
        <div key={project.id} className="my-6">
          <div className="overflow-hidden rounded-lg shadow bg-stone-50 flex flex-col md:flex-row">
            {/* Icon */}
            <div className="bg-stone-200 flex items-center justify-center md:w-32 w-full h-12 md:h-auto">
              <LayoutGrid width={40} height={40} className="text-gray-700" />
            </div>
            {/* Project Info */}
            <Link
              href={`/tasks?projectId=${project.id}`}
              className="flex-1 px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="mb-2 font-semibold text-emerald-700">
                {project.name}
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2 p-4 border-t md:border-t-0 md:border-l border-slate-100">
              <EditProjectForm
                project={project}
                onProjectChangedRefresh={handleProjectRefresh}
              />
              <DeleteProjectBtn
                projectId={project.id}
                onProjectChangedRefresh={handleProjectRefresh}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
