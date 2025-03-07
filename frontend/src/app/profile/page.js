"use client"; // Required for client-side interactivity


import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: "8EGKlHuKUby_oFrZ8gC2M8OSNPQmcDrC", // Replace with your Alchemy API Key
  network: Network.ETH_MAINNET,
});
export default function Profile() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        localStorage.setItem("walletAddress", accounts[0]); // Store wallet
        fetchNFTs(accounts[0]); // Fetch NFTs after connecting
      } catch (error) {
        console.error("MetaMask connection failed", error);
      }
    } else {
      alert("MetaMask not detected! Please install MetaMask.");
    }
  };

  // Function to disconnect MetaMask
  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem("walletAddress"); // Clear stored wallet
    setNfts([]); // Clear NFTs on disconnect
  };

  // Fetch NFTs from Alchemy
  const fetchNFTs = async (wallet) => {
    try {
      setLoading(true);
      const response = await alchemy.nft.getNftsForOwner(wallet);
      setNfts(response.ownedNfts);
    } catch (error) {
      console.error("Failed to fetch NFTs", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
      setIsConnected(true);
      fetchNFTs(storedWallet);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-gray-400">Manage your Cybernetix account</p>

        {isConnected ? (
          <div className="mt-4">
            <p><strong>Wallet:</strong> {walletAddress}</p>
            <p className="text-green-400 mt-2">✅ Connected</p>

            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>

            <h2 className="text-lg font-bold mt-4">Your NFTs:</h2>

            {loading ? (
              <p className="text-gray-400">Loading NFTs...</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {nfts.length > 0 ? (
                  nfts.map((nft, index) => (
                    <div key={index} className="bg-gray-700 p-2 rounded">
                      <img src={nft.rawMetadata?.image || "/default-nft.png"} alt="NFT" className="w-24 h-24 mx-auto" />
                      <p className="text-sm mt-1">{nft.title || "Unnamed NFT"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No NFTs found.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={connectWallet}
          >
            Connect MetaMask
          </button>
        )}
      </div>
    </div>
  );
}
