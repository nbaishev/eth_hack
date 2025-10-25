import { useState } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();

        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Ошибка подключения:', error);
      }
    } else {
      alert('Установите MetaMask!');
    }
  };

  return { connectWallet, account, provider, signer };
};
