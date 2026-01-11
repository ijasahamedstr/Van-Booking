 import React from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Container,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { Link } from "react-router-dom";

/* ---------------- FONT ---------------- */
const TAJAWAL = '"Montserrat", sans-serif';

/* ---------------- IMAGE URLS ---------------- */
const VAN_IMAGE_URL =
  "https://i.ibb.co/Wv2z7Jd0/Gemini-Generated-Image-1ltd7r1ltd7r1ltd-removebg-preview.png";
const CALENDAR_IMAGE_URL =
  "https://i.ibb.co/hxChYFH9/istockphoto-1742244777-612x612-removebg-preview.png";
const SPECIAL_REQUEST_IMAGE_URL =
  "https://i.ibb.co/zTcsZfQg/Gemini-Generated-Image-an9h0uan9h0uan9h-removebg-preview.png";

/* ---------------- ANIMATIONS ---------------- */
const tap = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(.96); }
`;

const float = keyframes`
  0% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -18px); }
  100% { transform: translate(-50%, 0); }
`;

const bubbleFloat = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: .45;
  }
  100% {
    transform: translateY(-120px) scale(1.4);
    opacity: 0;
  }
`;

/* ---------------- CARD ITEM ---------------- */
type ServiceCardProps = {
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  link: string;
};

const ServiceCard = ({
  title,
  subtitle,
  image,
  gradient,
  link,
}: ServiceCardProps) => {
  return (
    <Box sx={{ position: "relative", pt: 14 }}>
      {/* FLOATING IMAGE (OUTSIDE CARD – OK) */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: 230,
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          animation: `${float} 4s ease-in-out infinite`,
          filter: "drop-shadow(0 35px 55px rgba(0,0,0,.55))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* CARD */}
      <Card
        sx={{
          borderRadius: 6,
          position: "relative",
          overflow: "hidden", // 🔒 CLIP EVERYTHING
          background: gradient,
          color: "#fff",
          boxShadow: "0 30px 70px rgba(0,0,0,.35)",
          transition: "transform .45s ease, box-shadow .45s ease",
          fontFamily: TAJAWAL,

          "&:hover": {
            transform: "translateY(-14px)",
            boxShadow: "0 45px 95px rgba(0,0,0,.45)",
          },

          "&:hover .bubble": {
            opacity: 1,
          },
        }}
      >
        {/* 🔵 BUBBLE LAYER (INSIDE CARD ONLY) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              className="bubble"
              sx={{
                position: "absolute",
                bottom: -30,
                left: `${Math.random() * 100}%`,
                width: `${6 + Math.random() * 14}px`,
                height: `${6 + Math.random() * 14}px`,
                borderRadius: "50%",
                background: "rgba(255,255,255,.35)",
                animation: `${bubbleFloat} linear infinite`,
                animationDuration: `${6 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 4}s`,
                opacity: 0,
              }}
            />
          ))}
        </Box>

        {/* CONTENT */}
        <CardActionArea
          component={Link}
          to={link}
          sx={{
            position: "relative",
            zIndex: 2, // ⬆ ABOVE BUBBLES
            pt: 10,
            pb: 4,
            px: 3,
            textAlign: "center",
            color: "inherit",
            textDecoration: "none",
            "&:active": {
              animation: `${tap} .12s ease-in-out`,
            },
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 19,fontFamily:TAJAWAL }}>
            {title}
          </Typography>

          <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.8,fontFamily:TAJAWAL }}>
            {subtitle}
          </Typography>

          <Typography sx={{ fontSize: 28, mt: 1.4, fontFamily:TAJAWAL }}>→</Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
};

/* ---------------- MAIN LIST ---------------- */
const ServiceCards: React.FC = () => {
  return (
    <Box sx={{ py: 9 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 7,
          }}
        >
          <ServiceCard
            title="VAN DETAILS"
            subtitle="Choose the van type and seating"
            gradient="linear-gradient(135deg, #023B4E, #046b82)"
            image={VAN_IMAGE_URL}
            link="/van-details"
          />

          <ServiceCard
            title="VAN BOOKING"
            subtitle="Select location and date"
            gradient="linear-gradient(135deg, #0f766e, #06f9f3)"
            image={CALENDAR_IMAGE_URL}
            link="/van-booking"
          />

          <ServiceCard
            title="SPECIAL REQUEST"
            subtitle="Add additional notes"
            gradient="linear-gradient(135deg, #7c3aed, #c084fc)"
            image={SPECIAL_REQUEST_IMAGE_URL}
            link="/special-request"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ServiceCards;
