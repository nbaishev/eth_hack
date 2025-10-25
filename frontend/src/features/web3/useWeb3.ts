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

  // Подключение кошелька
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Установите MetaMask!");
        return;
      }

      const _provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const _signer = await _provider.getSigner();
      const address = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(address);
      localStorage.setItem("walletAddress", address);
      return address;
    } catch (error: any) {
      if (error.code === 4001) {
        console.warn("Пользователь отклонил подключение");
      } else {
        console.error("Ошибка подключения кошелька:", error);
      }
    }
  };

  // Отключение кошелька
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    localStorage.removeItem("walletAddress");
  };

  // Восстановление при перезагрузке страницы
  useEffect(() => {
    const saved = localStorage.getItem("walletAddress");
    if (saved) {
      connectWallet();
    }
  }, []);

  return { provider, signer, account, connectWallet, disconnectWallet };
};
