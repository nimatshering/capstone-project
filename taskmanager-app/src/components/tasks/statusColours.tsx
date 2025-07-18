import React from "react";

type TaskStatusType = "Done" | "In-progress" | "At-Risk";

interface TaskStatusProps {
  status: TaskStatusType;
}

const statusColors: Record<TaskStatusType, string> = {
  Done: "bg-blue-400",
  "In-progress": "bg-green-400",
  "At-Risk": "bg-red-400",
};

const TaskStatus: React.FC<TaskStatusProps> = ({ status }) => {
  return (
    <div
      className={`py-2 rounded-lg text-white w-full text-center ${statusColors[status]}`}
    >
      {status}
    </div>
  );
};

export default TaskStatus;
