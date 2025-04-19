"use client";

import { useState } from "react";
import { ethers } from "ethers";
import WalletConnect from "../components/WalletConnect";
import ThemeToggle from "../theme/ThemeToggle";

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const handleWalletConnected = (
    address: string,
    providerInstance: ethers.BrowserProvider
  ) => {
    setAccount(address);
    setProvider(providerInstance);
  };

  return (
    <>
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white dark:bg-[#191919] text-black dark:text-white shadow-md transition-colors">
        <h1 className="font-bold text-lg">🧠 My DApp</h1>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6 sm:p-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-400 drop-shadow-lg">
            📝 Decentralized To-Do List
          </h1>

          {!account ? (
            <div className="flex justify-center items-center h-40">
              <WalletConnect onConnected={handleWalletConnected} />
            </div>
          ) : (
            <>
            <p> Add Task Form</p>
            <p>Task List Form</p>
              {/* <AddTaskForm account={account} provider={provider} />
              <TaskList account={account} provider={provider} /> */}
            </>
          )}
        </div>
      </div>
    </>
  );
}
