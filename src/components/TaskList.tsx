"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Task } from "@/types";
import abi from "../constants/TodoDappABI.json";
import Pagination from "./Pagination";

const CONTRACT_ADDRESS = "0x1DCbA5ACbD5e0d535e64281940C69E5618252A51";
const CONTRACT_ABI = abi;
const ITEMS_PER_PAGE = 10;

export default function TaskList({
  account,
  provider,
  reloadTrigger,
}: {
  account: string;
  provider: ethers.BrowserProvider | null;
  reloadTrigger: number;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (account && provider) {
      fetchTasks();
    }
  }, [account, provider, reloadTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tasksFromChain = await contract.getMyTasks();
      setTasks(tasksFromChain);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleComplete = async (taskId: number) => {
    try {
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.toggleTaskStatus(taskId);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div className="text-center text-gray-500 mt-8">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return <div className="text-center text-gray-500 mt-8">No tasks found. Add your first one!</div>;
  }

  return (
    <>
      {paginatedTasks.map((task) => (
        <div
          key={task.id.toString()}
          className="task-card bg-[var(--card)] p-4 rounded shadow mb-4 flex justify-between items-center"
        >
          <div className="task-content">
            <div className={`task-name text-lg ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </div>
            <div className="task-metadata text-sm text-gray-500">
              Added {new Date(Number(task.createdAt) * 1000).toLocaleDateString()}
              {task.completed &&
                ` | Completed ${new Date(Number(task.completedAt) * 1000).toLocaleDateString()}`}
            </div>
          </div>
          <div className="task-actions flex gap-2">
            <button className="action-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              className="accent-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}
