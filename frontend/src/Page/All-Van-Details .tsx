import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Container,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ---------------- CONFIG & FONT ---------------- */

const TAJAWAL = '"Montserrat", sans-serif';
const API_HOST = import.meta.env.VITE_API_HOST as string;

/* ---------------- INTERFACE ---------------- */

interface VanData {
  _id: string;
  vanname: string;
  Seat: number;
  Type: "AC" | "NoAC";
  type2: "Automatic" | "Manual";
  Image: string[];
}

/* ---------------- COMPONENT ---------------- */

const VanCards: React.FC = () => {
  const [vans, setVans] = useState<VanData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   const navigate = useNavigate(); // ✅ FIX

  useEffect(() => {
    const fetchVans = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${API_HOST}/Vanaddinfo`);
        if (!resp.ok) throw new Error("Failed to fetch data from the server");
        const data = await resp.json();
        setVans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVans();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontFamily: TAJAWAL,
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10, fontFamily: TAJAWAL }}>
        <Typography color="error" fontFamily={TAJAWAL}>
          Error: {error}
        </Typography>
        <Button
          onClick={() => window.location.reload()}
          sx={{ mt: 2, fontFamily: TAJAWAL }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, background: "#f4f6f8", fontFamily: TAJAWAL }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {vans.map((van) => (
            <Card
              key={van._id}
              sx={{
                p: 3,
                borderRadius: 5,
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                transition: "all 0.4s ease",
                fontFamily: TAJAWAL,
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* IMAGE */}
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
                      transform: "rotateX(8deg) rotateY(-8deg) scale(1.05)",
                    },
                  }}
                >
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
                  <Box
                    component="img"
                    src={van.Image[0]}
                    alt={van.vanname}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 170,
                      transform: "translateZ(40px)",
                      filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.35))",
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
                {van.vanname}
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
                <Typography fontFamily={TAJAWAL} color="text.secondary">
                  Seats
                </Typography>
                <Typography fontFamily={TAJAWAL} fontWeight={600}>
                  {van.Seat} Seater
                </Typography>

                <Typography fontFamily={TAJAWAL} color="text.secondary">
                  AC Status
                </Typography>
                <Typography fontFamily={TAJAWAL} fontWeight={600}>
                  {van.Type}
                </Typography>

                <Typography fontFamily={TAJAWAL} color="text.secondary">
                  Transmission
                </Typography>
                <Typography fontFamily={TAJAWAL} fontWeight={600}>
                  {van.type2}
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
                Professional {van.vanname} available for booking.
              </Typography>

              {/* BUTTON */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/van/${van._id}`)}
                sx={{
                  mt: "auto",
                  py: 1.3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg,#ff9800,#ff5722)",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: TAJAWAL,
                  "&:hover": {
                    background: "linear-gradient(135deg,#ff5722,#ff9800)",
                  },
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
