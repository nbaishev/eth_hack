import { styled } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { greeterABI } from "../greeteABI.js";

// ❌ Убираем import "./App.css" — этот файл отсутствует, из-за этого ошибка

export const AppButton = () => {
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // твой контракт

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [newGreeting, setNewGreeting] = useState("");

  console.log(provider, signer, contract);

  useEffect(() => {
    const init = async () => {
      const ethProvider = await detectEthereumProvider();
      if (ethProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(ethProvider);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          greeterABI,
          signer
        );

        setProvider(ethersProvider);
        setSigner(signer);
        setContract(contract);

        // Читаем текущее приветствие
        const msg = await contract.greet();
        setGreeting(msg);
      } else {
        alert("Установи MetaMask!");
      }
    };

    init();
  }, []);

  const updateGreeting = async () => {
    if (contract && newGreeting) {
      const tx = await contract.setGreeting(newGreeting);
      await tx.wait();
      const updated = await contract.greet();
      setGreeting(updated);
    }
    console.log("Transaction sent:", );
  };

  return (
    <>
      <Container>
        <h1>dApp для хакатона</h1>
        <p>Текущее приветствие: {greeting}</p>
        <Input
          value={newGreeting}
          onChange={(e) => setNewGreeting(e.target.value)}
          placeholder="Новое приветствие"
        />
        <StyledAppButton onClick={updateGreeting}>Ckik</StyledAppButton>
      </Container>
    </>
  );
};

// --- Стили ---
const StyledAppButton = styled("button")({
  backgroundColor: "#4e40ed",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#9a92f1b4",
  },
  "&:active": {
    backgroundColor: "#352d94",
  },
});

const Container = styled("div")({
  marginTop: "20px",
  textAlign: "center",
});

const Input = styled("input")({
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginRight: "10px",
});

const Button = styled("button")({
  backgroundColor: "#4e40ed",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#6a5df0",
  },
});
