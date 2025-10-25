import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

interface ErrorState {
  message?: string;
}

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorState | null;

  const message =
    state?.message ||
    "Произошла ошибка. Возможно вы не подключили кошелёк или отменили транзакцию.";

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" color="error">
        ❌ Ошибка
      </Typography>
      <Typography sx={{ mt: 2 }}>{message}</Typography>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          На главную
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
