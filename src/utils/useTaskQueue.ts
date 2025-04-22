import { useState } from "react";
import { Task } from "@/types";

export type TaskOperation = {
  action: "add" | "edit" | "delete" | "toggle";
  task: Partial<Task> & { id: number };
};

export function useTaskQueue() {
  const [queue, setQueue] = useState<TaskOperation[]>([]);

  const addToQueue = (operation: TaskOperation) => {
    setQueue((prev) => [...prev, operation]);
  };

  const clearQueue = () => setQueue([]);

  return {
    queue,
    addToQueue,
    clearQueue,
  };
}
