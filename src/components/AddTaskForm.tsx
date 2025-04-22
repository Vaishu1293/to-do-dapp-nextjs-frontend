"use client";

import { useState } from "react";
import { ethers } from "ethers";
import abi from "../constants/TodoDappABI.json";

type Props = {
  account: string;
  provider: ethers.BrowserProvider | null;
  onTaskAdded: () => void;
};

const CONTRACT_ADDRESS = "0x1DCbA5ACbD5e0d535e64281940C69E5618252A51";

export default function AddTaskForm({ account, provider, onTaskAdded }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !account || !title || !content) return;

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.addTask(title, content);
      await tx.wait();
      onTaskAdded(); // ✅ now works correctly
      alert("Task added successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-input-area bg-[var(--card)] p-5 w-full rounded-b-lg shadow flex flex-col gap-4"
    >
      <input
        type="text"
        className="p-2 border border-gray-300 rounded"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="p-2 border border-gray-300 rounded"
        placeholder="Task Details"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />
      <button
        type="submit"
        className="bg-[var(--accent)] text-white px-4 py-2 rounded self-end"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
