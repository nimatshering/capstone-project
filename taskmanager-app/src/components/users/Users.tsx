"use client";
import DeleteUserBtn from "./deleteUser";
import { EditUserForm } from "./editUser";
import { useEffect, useState } from "react";
import { CreateUser } from "./createUser";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  Function to fetchUsers
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get users
  const handleFetchUsers = () => {
    fetchUsers();
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
        <CreateUser onUserChangedRefresh={handleFetchUsers} />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="table-auto w-full border-collapse rounded text-left">
          <thead className="bg-stone-100">
            <tr>
              <th className="border-b border-gray-200 px-4 py-4">Sl#</th>
              <th className="border-b border-gray-200 px-4 py-4">Full Name</th>
              <th className="border-b border-gray-200 px-4 py-4">Username</th>
              <th className="border-b border-gray-200 px-4 py-4">Email</th>
              <th className="border-b border-gray-200 p-8 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="w-10 border-b border-gray-200 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {user.fullname}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {user.username}
                  <div className="text-gray-600 text-xs">{user.email}</div>
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  {user.email}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  <div className="flex justify-end ">
                    <EditUserForm
                      onUserChangedRefresh={handleFetchUsers}
                      user={user}
                    />
                    <DeleteUserBtn
                      onUserChangedRefresh={handleFetchUsers}
                      userId={user.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
