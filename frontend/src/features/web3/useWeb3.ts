import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const targetChainId = 11155111n; // ✅ Sepolia Testnet (можно поменять)

  // 🔹 Подключение кошелька
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("🦊 Установите MetaMask!");
        return;
      }

      // Запрос на подключение аккаунта
      const [selectedAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const network = await _provider.getNetwork();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(selectedAddress);
      setNetwork(network.name);

      console.log("Connected to network:", network);

      // Проверка сети
      if (network.chainId !== targetChainId) {
        await switchNetwork();
      }

      // Сохраняем подключение
      localStorage.setItem("walletAddress", selectedAddress);
      return selectedAddress;
    } catch (error: any) {
      if (error.code === 4001) {
        console.warn("🚫 Пользователь отклонил подключение");
      } else {
        console.error("Ошибка при подключении MetaMask:", error);
      }
    }
  };

  // 🔹 Переключение сети (Sepolia)
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.toBeHex(targetChainId) }],
      });
      console.log("✅ Сеть успешно переключена на Sepolia");
    } catch (error: any) {
      if (error.code === 4902) {
        // если сеть ещё не добавлена
        await addNetwork();
      } else {
        console.error("❌ Ошибка при переключении сети:", error);
      }
    }
  };

  // 🔹 Добавление сети, если её нет
  const addNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7", // hex для Sepolia
            chainName: "Sepolia Test Network",
            nativeCurrency: {
              name: "Sepolia ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
      console.log("✅ Сеть Sepolia добавлена");
    } catch (error) {
      console.error("Ошибка добавления сети:", error);
    }
  };

  // 🔹 Отключение кошелька
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setNetwork(null);
    localStorage.removeItem("walletAddress");
  };

  // 🔹 Автоматическое восстановление подключения
  useEffect(() => {
    const saved = localStorage.getItem("walletAddress");
    if (saved && window.ethereum) {
      connectWallet();
    }

    // Автоматическая реакция на смену сети
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return {
    provider,
    signer,
    account,
    network,
    connectWallet,
    disconnectWallet,
  };
};
