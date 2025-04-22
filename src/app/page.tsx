"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnect from "../components/WalletConnect";
import ThemeToggle from "../theme/ThemeToggle";
import AddTaskForm from "@/components/AddTaskForm";
import TaskList from "@/components/TaskList";
import abi from "../constants/TodoDappABI.json"; // ABI file must be present

const CONTRACT_ADDRESS = "0x1DCbA5ACbD5e0d535e64281940C69E5618252A51"; // Replace with real address

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  const handleWalletConnected = (
    address: string,
    providerInstance: ethers.BrowserProvider
  ) => {
    setAccount(address);
    setProvider(providerInstance);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!provider || !account) return;
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const taskData = await contract.getMyTasks();
        setTasks(taskData);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [provider, account]);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center p-6">
      {/* Navbar */}
      <nav className="bg-[var(--nav-bg)] text-white px-6 py-4 w-full max-w-3xl flex justify-between items-center rounded-t-lg">
        <div className="text-xl font-bold">Decentralized Tasks</div>
        <div className="flex items-center gap-4">
          {account && (
            <div className="text-sm">Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {/* Wallet Connection or Content */}
      {!account ? (
        <div className="my-12">
          <WalletConnect onConnected={handleWalletConnected} />
        </div>
      ) : (
        <>
          {/* Task Input Area */}
          <div className="w-full max-w-3xl">
            <AddTaskForm account={account} provider={provider} />
          </div>

          {/* Task List */}
          <div className="task-list-area w-full max-w-3xl mt-6">
          <TaskList account={account} provider={provider} />
          </div>

          <footer className="mt-8 text-sm text-gray-500">© 2025 Decentralized To-Do List</footer>
        </>
      )}
    </main>
  );
}