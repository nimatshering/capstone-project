"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Component, Loader2 } from "lucide-react";
import { CreateProject } from "./createProject";
import { EditProjectForm } from "./editUser";
import DeleteProjectBtn from "./deleteProject";
import { User, Project } from "@/db/schema";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userMap = new Map(users.map((u) => [u.id, u.fullname]));

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
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  //Refresh data after add/update/delete
  const handleProjectRefresh = () => {
    fetchProjects();
  };

  //show spinner if data is loading
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
          <div className="overflow-hidden rounded-lg shadow bg-stone-50 flex flex-col md:flex-row items-center">
            <div className="bg-stone-200 flex items-center justify-center md:w-32 w-full h-auto p-10">
              <Component width={60} height={60} className="text-gray-700" />
            </div>

            <div className="w-full">
              <div className="flex flex-col md:flex-row">
                <Link
                  href={`/dashboard/tasks?projectId=${project.id}`}
                  className="flex-1 px-4 py-3 hover:bg-gray-50 transition"
                >
                  <div className="mb-2 font-semibold text-emerald-700">
                    {project.name}
                  </div>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </Link>
              </div>
              <div
                className="md:w-50 rounded-full text-center bg-sky-400 py-2 px-4 text-xs font-bold text-white mx-2"
                data-ripple-light="true"
              >
                Owner: {userMap.get(project.createdBy) ?? "Unknown User"}
              </div>
            </div>

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
