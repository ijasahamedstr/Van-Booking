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

const MONTSERRAT = '"Montserrat", sans-serif';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const resp = await fetch(`${API_HOST}/Vanaddinfo`);
        if (!resp.ok) throw new Error("Failed to fetch vans");
        setVans(await resp.json());
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
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: MONTSERRAT,
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10, fontFamily: MONTSERRAT }}>
        <Typography color="error" fontFamily={MONTSERRAT}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 9,
        background: "#f2f4f7",
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3,1fr)",
            },
            gap: 5,
            perspective: "1400px",
          }}
        >
          {vans.map((van) => (
            <Box
              key={van._id}
              sx={{
                transformStyle: "preserve-3d",
                transition: "transform .5s ease",
                fontFamily: MONTSERRAT,
                "&:hover": {
                  transform: "rotateX(10deg) rotateY(-10deg)",
                },
              }}
            >
              <Card
                sx={{
                  position: "relative",
                  p: 3,
                  height: "100%",
                  borderRadius: 5,
                  background: "linear-gradient(180deg,#ffffff,#f8fafc)",
                  boxShadow: "0 25px 55px rgba(0,0,0,.18)",
                  transformStyle: "preserve-3d",
                  transition: "all .5s ease",
                  fontFamily: MONTSERRAT,
                  "&:hover": {
                    boxShadow: "0 40px 85px rgba(0,0,0,.28)",
                  },
                }}
              >
                {/* GLOW */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 5,
                    background:
                      "radial-gradient(circle at top, rgba(255,152,0,.25), transparent 60%)",
                    transform: "translateZ(-60px)",
                  }}
                />

                {/* IMAGE */}
                <Box
                  sx={{
                    height: 190,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translateZ(60px)",
                  }}
                >
                  <Box
                    component="img"
                    src={van.Image[0]}
                    alt={van.vanname}
                    sx={{
                      maxHeight: 170,
                      filter:
                        "drop-shadow(0 30px 40px rgba(0,0,0,.35))",
                      transition: "transform .5s ease",
                      "&:hover": {
                        transform: "scale(1.08)",
                      },
                    }}
                  />
                </Box>

                {/* CONTENT */}
                <Box
                  sx={{
                    transform: "translateZ(40px)",
                    fontFamily: MONTSERRAT,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 18,
                      color: "#ff9800",
                      mb: 1,
                      fontFamily: MONTSERRAT,
                    }}
                  >
                    {van.vanname}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                      fontFamily: MONTSERRAT,
                    }}
                  >
                    <Typography color="text.secondary" fontFamily={MONTSERRAT}>
                      Seats
                    </Typography>
                    <Typography fontWeight={600} fontFamily={MONTSERRAT}>
                      {van.Seat}
                    </Typography>

                    <Typography color="text.secondary" fontFamily={MONTSERRAT}>
                      AC
                    </Typography>
                    <Typography fontWeight={600} fontFamily={MONTSERRAT}>
                      {van.Type}
                    </Typography>

                    <Typography color="text.secondary" fontFamily={MONTSERRAT}>
                      Transmission
                    </Typography>
                    <Typography fontWeight={600} fontFamily={MONTSERRAT}>
                      {van.type2}
                    </Typography>
                  </Box>

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mt={2}
                    fontFamily={MONTSERRAT}
                  >
                    Professional {van.vanname} available for booking.
                  </Typography>
                </Box>

                {/* BUTTON */}
                <Button
                  fullWidth
                  onClick={() => navigate(`/van/${van._id}`)}
                  sx={{
                    mt: 3,
                    py: 1.3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg,#ff9800,#ff5722)",
                    color: "#fff",
                    fontWeight: 700,
                    textTransform: "none",
                    fontFamily: MONTSERRAT,
                    transform: "translateZ(50px)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#ff5722,#ff9800)",
                    },
                  }}
                >
                  View Details
                </Button>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default VanCards;
