import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";

/* ---------------- CONFIG ---------------- */

const MONTSERRAT = '"Montserrat", sans-serif';
const API_HOST = import.meta.env.VITE_API_HOST as string;

/* ---------------- TYPES ---------------- */

interface VanData {
  _id: string;
  vanname: string;
  Seat: number;
  Type: "AC" | "NoAC";
  type2: "Automatic" | "Manual";
  Image: string[];
}

/* ---------------- COMPONENT ---------------- */

const VanDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [van, setVan] = useState<VanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchVan = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_HOST}/Vanaddinfo/${id}`);
        if (!res.ok) throw new Error("Failed to load van details");
        const data = await res.json();
        setVan(data?.data ?? data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVan();
  }, [id]);

  /* ---------------- LOADING ---------------- */

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

  /* ---------------- ERROR ---------------- */

  if (!van || error) {
    return (
      <Box sx={{ textAlign: "center", py: 10, fontFamily: MONTSERRAT }}>
        <Typography color="error" fontFamily={MONTSERRAT}>
          Failed to load van details
        </Typography>
        <Button sx={{ mt: 2, fontFamily: MONTSERRAT }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <Box sx={{ py: 8, background: "#f4f6f8", fontFamily: MONTSERRAT }}>
      <Container maxWidth="md">
        <Box
          sx={{
            background: "#fff",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            fontFamily: MONTSERRAT,
          }}
        >
          {/* MAIN IMAGE */}
          <Box sx={{ mb: 3 }}>
            <Box
              component="img"
              src={van.Image?.[0]}
              alt={van.vanname}
              sx={{
                width: "100%",
                maxHeight: 350,
                objectFit: "contain",
                borderRadius: 3,
              }}
            />
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 800,
              color: "#ff9800",
              mb: 1,
              fontFamily: MONTSERRAT,
            }}
          >
            {van.vanname}
          </Typography>

          <Typography color="text.secondary" mb={3} fontFamily={MONTSERRAT}>
            Comfortable and reliable van available for booking.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* DETAILS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography fontFamily={MONTSERRAT}>
              <strong>Seats:</strong> {van.Seat} Seater
            </Typography>

            <Typography fontFamily={MONTSERRAT}>
              <strong>AC Type:</strong>{" "}
              <Chip
                label={van.Type}
                size="small"
                color={van.Type === "AC" ? "success" : "default"}
                sx={{ fontFamily: MONTSERRAT }}
              />
            </Typography>

            <Typography fontFamily={MONTSERRAT}>
              <strong>Transmission:</strong>{" "}
              <Chip
                label={van.type2}
                size="small"
                color="info"
                sx={{ fontFamily: MONTSERRAT }}
              />
            </Typography>
          </Box>

          {/* GALLERY */}
          <Divider sx={{ my: 4 }} />

          <Typography
            sx={{
              fontWeight: 700,
              mb: 2,
              fontFamily: MONTSERRAT,
            }}
          >
            Gallery
          </Typography>

          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {van.Image.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`gallery-${index}`}
                onClick={() => {
                  setActiveImage(img);
                  setOpen(true);
                }}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            ))}
          </Masonry>

          {/* ACTION BUTTONS - BOTTOM */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 5,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                flex: 1,
                py: 1.4,
                fontWeight: 700,
                borderRadius: 3,
                background: "linear-gradient(135deg,#ff9800,#ff5722)",
                fontFamily: MONTSERRAT,
              }}
              onClick={() =>
                window.open(
                  `https://wa.me/94768696704?text=I want to book ${van.vanname}`,
                  "_blank"
                )
              }
            >
              Book via WhatsApp
            </Button>

            <Button
              variant="outlined"
              sx={{
                flex: 1,
                py: 1.4,
                fontFamily: MONTSERRAT,
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Container>

      {/* IMAGE PREVIEW DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <Box
          component="img"
          src={activeImage}
          alt="preview"
          sx={{
            width: "100%",
            maxHeight: "90vh",
            objectFit: "contain",
            fontFamily: MONTSERRAT,
          }}
        />
      </Dialog>
    </Box>
  );
};

export default VanDetails;
