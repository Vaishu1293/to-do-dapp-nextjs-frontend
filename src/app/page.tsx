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
          <div className="task-input-area bg-[var(--card)] p-5 w-full max-w-3xl rounded-b-lg shadow flex gap-4">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded"
              placeholder="Add New Task..."
            />
            <button className="bg-[var(--accent)] text-white px-4 py-2 rounded">Add</button>
          </div>

          {/* Task List */}
          <div className="task-list-area w-full max-w-3xl mt-6">
            <div className="task-card bg-[var(--card)] p-4 rounded shadow mb-4 flex justify-between items-center">
              <div className="task-content">
                <div className="task-name text-lg">Grocery Shopping</div>
                <div className="task-metadata text-sm text-gray-500">Added 2 days ago</div>
              </div>
              <div className="task-actions flex gap-2">
                <button className="action-btn">✏️</button>
                <button className="action-btn">🗑️</button>
                <input type="checkbox" />
              </div>
            </div>

            <div className="task-card bg-[var(--card)] p-4 rounded shadow mb-4 flex justify-between items-center">
              <div className="task-content">
                <div className="task-name line-through text-gray-400">Pay Bills</div>
                <div className="task-metadata text-sm text-gray-500">Added 5 days ago | Completed 1 day ago</div>
              </div>
              <div className="task-actions flex gap-2">
                <button className="action-btn">✏️</button>
                <button className="action-btn">🗑️</button>
                <input type="checkbox" checked />
              </div>
            </div>

            <div className="task-card bg-[var(--card)] p-4 rounded shadow mb-4 flex justify-between items-center">
              <div className="task-content">
                <div className="task-name text-lg">Book Appointment</div>
                <div className="task-metadata text-sm text-gray-500">Added 1 day ago</div>
              </div>
              <div className="task-actions flex gap-2">
                <button className="action-btn">✏️</button>
                <button className="action-btn">🗑️</button>
                <input type="checkbox" />
              </div>
            </div>

            <div className="pagination flex gap-2 justify-center mt-4">
              <button className="page-number active bg-[var(--primary)] text-white border px-3 py-1 rounded">1</button>
              <button className="page-number border border-gray-300 px-3 py-1 rounded">2</button>
              <button className="page-number border border-gray-300 px-3 py-1 rounded">Next</button>
            </div>
          </div>

          <footer className="mt-8 text-sm text-gray-500">© 2025 Decentralized To-Do List</footer>
        </>
      )}
    </main>
  );
}
