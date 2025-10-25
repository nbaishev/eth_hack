import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useWeb3 } from "../features/web3/useWeb3";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { disconnectWallet } = useWeb3();

  // получаем txHash из navigate state
  const state = location.state as { txHash?: string } | null;
  const txHash = state?.txHash;

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4">Успешно! 🎉</Typography>
      <Typography sx={{ mt: 2 }}>
        Транзакция:{" "}
        {txHash ? (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 8)}...{txHash.slice(-8)}
          </a>
        ) : (
          "—"
        )}
      </Typography>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          На главную
        </Button>

        <Button color="secondary" variant="outlined" onClick={() => disconnectWallet()}>
          Открепить кошелёк
        </Button>
      </Box>
    </Box>
  );
};

export default Success;
