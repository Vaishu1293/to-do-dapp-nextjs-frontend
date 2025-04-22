"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Task } from "@/types";
import abi from "../constants/TodoDappABI.json";
import Pagination from "./Pagination";
import Modal from "./Modal";


const CONTRACT_ADDRESS = "0x1DCbA5ACbD5e0d535e64281940C69E5618252A51";
const CONTRACT_ABI = abi;
const ITEMS_PER_PAGE = 3;

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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
      const tasksFromChain = await contract.getPendingTasks();
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

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedContent(task.content);
  };

  const saveEdit = async () => {
    if (editingTaskId === null) return;
    try {
      const signer = await provider!.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const taskToUpdate = tasks.find((t) => t.id === editingTaskId);
      if (!taskToUpdate) return;
      const tx = await contract.updateTask(editingTaskId, editedTitle, editedContent, taskToUpdate.completed);
      await tx.wait();
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
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
    return <div className="text-center text-gray-500 mt-8">No pending tasks found.</div>;
  }

  return (
    <>
      {paginatedTasks.map((task) => (
        <div
          key={task.id.toString()}
          onClick={() => setSelectedTask(task)}
          className="task-card bg-[var(--card)] p-4 rounded shadow mb-4 flex justify-between items-center cursor-pointer"
        >
          <div className="task-content">
            {editingTaskId === task.id ? (
              <>
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mb-1 p-1 rounded border"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full mt-2 p-1 rounded border text-sm"
                />
              </>
            ) : (
              <>
                <div className={`task-name text-lg ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </div>
                <div className="task-metadata text-sm text-gray-500">
                  Added {new Date(Number(task.createdAt) * 1000).toLocaleDateString()}
                  {task.completed &&
                    ` | Completed ${new Date(Number(task.completedAt) * 1000).toLocaleDateString()}`}
                </div>
              </>
            )}
          </div>
          <div className="task-actions flex items-center gap-2 ml-4">
            {editingTaskId === task.id ? (
              <button className="action-btn" onClick={saveEdit}>💾</button>
            ) : (
              <button className="action-btn" onClick={(e) => { e.stopPropagation(); startEditing(task); }}>✏️</button>
            )}
            <button className="action-btn" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>🗑️</button>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
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

      {selectedTask && (
        <Modal onClose={() => setSelectedTask(null)}>
          <div className="text-lg font-bold mb-2">{selectedTask.title}</div>
          <div className="text-sm whitespace-pre-wrap">{selectedTask.content}</div>
          <div className="text-xs text-gray-500 mt-2">
            Created on: {new Date(Number(selectedTask.createdAt) * 1000).toLocaleString()}
            {selectedTask.completed && (
              <> | Completed on: {new Date(Number(selectedTask.completedAt) * 1000).toLocaleString()}</>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
