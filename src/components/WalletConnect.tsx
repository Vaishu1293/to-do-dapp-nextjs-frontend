"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Filter for MetaMask if multiple providers are injected
function getMetaMaskProvider(): any {
  const { ethereum } = window;

  if (!ethereum) return null;

  if (ethereum.providers?.length) {
    return ethereum.providers.find((p: any) => p.isMetaMask);
  }

  return ethereum.isMetaMask ? ethereum : null;
}

export default function WalletConnect({
  onConnected,
}: {
  onConnected: (account: string, provider: ethers.BrowserProvider) => void;
}) {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const eth = getMetaMaskProvider();
    if (eth) {
      eth.on("accountsChanged", connectWallet);
    }
  }, []);

  async function connectWallet() {
    const ethereum = getMetaMaskProvider();

    if (!ethereum) {
      alert("MetaMask is not installed or not set as default Ethereum provider.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      onConnected(address, provider);
    } catch (err) {
      console.error("MetaMask connection failed:", err);
    }
  }

  return (
    <div className="p-4">
      {account ? (
        <div className="text-green-500">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
