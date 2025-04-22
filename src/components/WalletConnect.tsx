"use client";

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

// Type for Ethereum provider from MetaMask
interface EthereumProvider extends ethers.Eip1193Provider {
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
}

// Filter for MetaMask if multiple providers are injected
function getMetaMaskProvider(): EthereumProvider | null {
  const ethereum = window.ethereum as EthereumProvider | undefined;
  if (!ethereum) return null;

  if (ethereum.providers?.length) {
    return ethereum.providers.find((p) => p.isMetaMask) || null;
  }

  return ethereum.isMetaMask ? ethereum : null;
}

export default function WalletConnect({
  onConnected,
}: {
  onConnected: (account: string, provider: ethers.BrowserProvider) => void;
}) {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    const ethereum = getMetaMaskProvider();
    if (!ethereum) {
      alert("MetaMask is not installed or not set as the default Ethereum provider.");
      return;
    }

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      onConnected(address, provider);
    } catch (err) {
      console.error("MetaMask connection failed:", err);
    }
  }, [onConnected]);

  useEffect(() => {
    const eth = getMetaMaskProvider();
    if (eth?.on) {
      eth.on("accountsChanged", connectWallet);
    }
    return () => {
      if (eth?.on) eth.on("accountsChanged", () => {}); // cleanup
    };
  }, [connectWallet]);

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
