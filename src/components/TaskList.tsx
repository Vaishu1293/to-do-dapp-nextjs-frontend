"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Task } from "@/types";
import abi from "../constants/TodoDappABI.json"; // ABI file must be present
// ✅ Your deployed contract address
const CONTRACT_ADDRESS = "0x1DCbA5ACbD5e0d535e64281940C69E5618252A51"; // ⬅️ Replace with actual

// ✅ ABI of the contract (only the necessary parts)
const CONTRACT_ABI = abi;

export default function TaskList({
  account,
  provider,
}: {
  account: string;
  provider: ethers.BrowserProvider | null;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && provider) {
      fetchTasks();
    }
  }, [account, provider]);

  const fetchTasks = async () => {
    try {
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

  if (loading) {
    return <div className="text-center text-gray-500 mt-8">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return <div className="text-center text-gray-500 mt-8">No tasks found. Add your first one!</div>;
  }

  return (
    <>
      {tasks.map((task) => (
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
            <button className="action-btn">✏️</button>
            <button className="action-btn">🗑️</button>
            <input type="checkbox" checked={task.completed} readOnly className="accent-[var(--primary)]" />
          </div>
        </div>
      ))}
    </>
  );
}
