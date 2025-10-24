import { Box, styled } from "@mui/material";
import React from "react";

export const MainImg = () => {
  return (
    <StyledMainBox>
      <StyledImg src="src/assets/Dom1.jpeg" alt="Dom1" />
      <StyledImg src="src/assets/Dom2.jpeg" alt="Dom2" />
      <StyledImg src="src/assets/Dom3.jpeg" alt="Dom3" />
    </StyledMainBox>
  );
};
const StyledImg = styled("img")(({ theme }) => ({
  width: "500px",
  height: "390px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  transition: theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledMainBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
});
