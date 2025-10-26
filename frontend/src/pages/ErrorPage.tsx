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
    "Error. Probably you didn't connect the wallet or cancelled transaction.";

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" color="error">
        ❌ Error
      </Typography>
      <Typography sx={{ mt: 2 }}>{message}</Typography>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/")}>
          To main
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Return
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
