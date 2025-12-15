import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        py: 2,
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            fontSize: "0.85rem",
            fontFamily: "cursive",
          }}
        >
          Copyright © 2026 | ASHARY TRAVELS & TOURISUM. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
