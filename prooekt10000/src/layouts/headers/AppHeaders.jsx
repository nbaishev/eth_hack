import React from "react";
import { AppButton } from "../../components/UI/AppButton";
import { Box } from "@mui/material";
import styled from "@emotion/styled";

export const AppHeaders = () => {
  return (
    <header>
      <StyledHeaderBox>
        <Box>
          <StyledImg
            src="src/assets/Logo.jpeg"
            alt="LOGO"
          />
        </Box>
        <Box>
          <AppButton>clki</AppButton>
        </Box>
      </StyledHeaderBox>
    </header>
  );
};
const StyledHeaderBox= styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",

});

const StyledImg = styled("img")({
  width: "120px",
  height: "100px",
  backgroundImage: "none",
});
