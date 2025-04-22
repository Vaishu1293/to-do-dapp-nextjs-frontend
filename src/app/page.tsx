"use client";

import { useState } from "react";
import { ethers } from "ethers";
import WalletConnect from "../components/WalletConnect";
import ThemeToggle from "../theme/ThemeToggle";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // 🔁 Trigger to refresh task list

  const handleWalletConnected = (
    address: string,
    providerInstance: ethers.BrowserProvider
  ) => {
    setAccount(address);
    setProvider(providerInstance);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center p-6">
      <nav className="bg-[var(--nav-bg)] text-white px-6 py-4 w-full max-w-3xl flex justify-between items-center rounded-t-lg">
        <div className="text-xl font-bold">Decentralized Tasks</div>
        <div className="flex items-center gap-4">
          {account && (
            <div className="text-sm">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
          <ThemeToggle />
        </div>
      </nav>

      {!account ? (
        <div className="my-12">
          <WalletConnect onConnected={handleWalletConnected} />
        </div>
      ) : (
        <>
          {/* Add Task Form */}
          <div className="w-full max-w-3xl mt-4">
            <AddTaskForm
              account={account}
              provider={provider}
              onTaskAdded={() => setReloadTrigger((prev) => prev + 1)} // ✅ trigger list update
            />
          </div>

          {/* Task List */}
          <div className="w-full max-w-3xl mt-6">
            <TaskList
              account={account}
              provider={provider}
              reloadTrigger={reloadTrigger}
            />
          </div>
        </>
      )}
    </main>
  );
}
