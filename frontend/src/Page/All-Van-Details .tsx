import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Container,
  Divider,
} from "@mui/material";

/* ---------------- FONT ---------------- */

const TAJAWAL = "cursive";

/* ---------------- DATA ---------------- */

const vans = [
  {
    name: "Luxury Family Van",
    image:
      "https://i.ibb.co/Wv2z7Jd0/Gemini-Generated-Image-1ltd7r1ltd7r1ltd-removebg-preview.png",
    seats: "8 Seater",
    ac: "AC",
    type: "Automatic",
    description:
      "Comfortable luxury van suitable for long family trips.",
  },
  {
    name: "Executive Travel Van",
    image:
      "https://i.ibb.co/r2Cp8kcV/326794852-543189624509069-4363368338139961666-n-removebg-preview-1.png",
    seats: "12 Seater",
    ac: "AC",
    type: "Manual",
    description:
      "Spacious executive van with premium interiors.",
  },
  {
    name: "Cargo Utility Van",
    image:
      "https://i.ibb.co/Hf2P3vNw/Head-removebg-preview.png",
    seats: "2 Seater",
    ac: "Non-AC",
    type: "Manual",
    description:
      "Best for goods transport and utility purposes.",
  },
];

/* ---------------- COMPONENT ---------------- */

const VanCards: React.FC = () => {
  return (
    <Box sx={{ py: 8, background: "#f4f6f8", fontFamily: TAJAWAL }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {vans.map((van, index) => (
            <Card
              key={index}
              sx={{
                p: 3,
                borderRadius: 5,
                fontFamily: TAJAWAL,
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ================= 3D IMAGE ================= */}
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  perspective: "1000px",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s ease",
                    "&:hover": {
                      transform:
                        "rotateX(8deg) rotateY(-8deg) scale(1.05)",
                    },
                  }}
                >
                  {/* SHADOW */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      transform: "translateZ(-40px)",
                      filter: "blur(30px)",
                      background: "rgba(0,0,0,0.25)",
                      borderRadius: "50%",
                    }}
                  />

                  {/* IMAGE */}
                  <Box
                    component="img"
                    src={van.image}
                    alt={van.name}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 170,
                      transform: "translateZ(40px)",
                      filter:
                        "drop-shadow(0 25px 35px rgba(0,0,0,0.35))",
                      transition: "all 0.6s ease",
                    }}
                  />
                </Box>
              </Box>

              {/* TITLE */}
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#ff9800",
                  mb: 1,
                  fontFamily: TAJAWAL,
                }}
              >
                {van.name}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* DETAILS */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  fontSize: 13,
                  fontFamily: TAJAWAL,
                }}
              >
                <Typography color="text.secondary" fontFamily={TAJAWAL}>
                  Seats
                </Typography>
                <Typography fontWeight={600} fontFamily={TAJAWAL}>
                  {van.seats}
                </Typography>

                <Typography color="text.secondary" fontFamily={TAJAWAL}>
                  AC
                </Typography>
                <Typography fontWeight={600} fontFamily={TAJAWAL}>
                  {van.ac}
                </Typography>

                <Typography color="text.secondary" fontFamily={TAJAWAL}>
                  Transmission
                </Typography>
                <Typography fontWeight={600} fontFamily={TAJAWAL}>
                  {van.type}
                </Typography>
              </Box>

              {/* DESCRIPTION */}
              <Typography
                fontSize={12}
                color="text.secondary"
                mt={2}
                mb={3}
                fontFamily={TAJAWAL}
              >
                {van.description}
              </Typography>

              {/* BUTTON */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: "auto",
                  py: 1.3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg,#ff9800,#ff5722)",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: TAJAWAL,
                }}
              >
                View Details
              </Button>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default VanCards;
