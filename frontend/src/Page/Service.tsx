import React from "react";
import { Box, Typography, Card, CardActionArea, Container } from "@mui/material";
import { keyframes } from "@mui/system";
import { Link } from "react-router-dom";

/* ---------------- FONT & COLORS ---------------- */
const FONT_FAMILY = '"Inter", "Montserrat", sans-serif';
const TEXT_PRIMARY = "#f8fafc";

/* ---------------- IMAGE URLS ---------------- */
const VAN_IMAGE_URL = "https://i.ibb.co/Wv2z7Jd0/Gemini-Generated-Image-1ltd7r1ltd7r1ltd-removebg-preview.png";
const CALENDAR_IMAGE_URL = "https://i.ibb.co/hxChYFH9/istockphoto-1742244777-612x612-removebg-preview.png";
const SPECIAL_REQUEST_IMAGE_URL = "https://i.ibb.co/zTcsZfQg/Gemini-Generated-Image-an9h0uan9h0uan9h-removebg-preview.png";

/* ---------------- ANIMATIONS ---------------- */
const float = keyframes`
  0%, 100% { transform: translate(-50%, 0) scale(1); }
  50% { transform: translate(-50%, -15px) scale(1.05); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

/* ---------------- CARD ITEM ---------------- */
type ServiceCardProps = {
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
  link: string;
  index: string;
};

const ServiceCard = ({ title, subtitle, image, accentColor, link, index }: ServiceCardProps) => {
  return (
    <Box sx={{ position: "relative", pt: 12, pb: 2 }}>
      {/* 🚀 FLOATING IMAGE - Larger & Sharper */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: 240,
          position: "absolute",
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          animation: `${float} 5s ease-in-out infinite`,
          filter: `drop-shadow(0 20px 40px ${accentColor}66)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <Card
        sx={{
          borderRadius: "32px",
          background: "rgba(15, 23, 42, 0.8)", // Dark Slate
          backdropFilter: "blur(12px)",
          border: `1px solid rgba(255,255,255,0.1)`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          "&:hover": {
            transform: "translateY(-10px) rotateX(4deg) rotateY(-2deg)",
            boxShadow: `0 30px 60px -12px ${accentColor}44`,
            border: `1px solid ${accentColor}aa`,
          },
          "&:hover .shimmer": {
            animation: `${shimmer} 2.5s infinite`,
          },
        }}
      >
        {/* SHIMMER EFFECT ON HOVER */}
        <Box
          className="shimmer"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${accentColor}22, transparent)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* HOLOGRAPHIC BACKGROUND NUMBER */}
        <Typography
          sx={{
            position: "absolute",
            right: -10,
            bottom: -20,
            fontSize: "120px",
            fontWeight: 900,
            color: "rgba(255,255,255,0.03)",
            lineHeight: 1,
            zIndex: 0,
            pointerEvents: "none",
            fontFamily: FONT_FAMILY,
          }}
        >
          {index}
        </Typography>

        <CardActionArea
          component={Link}
          to={link}
          sx={{
            pt: 12,
            pb: 5,
            px: 4,
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {/* TAGLINE DECOR */}
          <Box
            sx={{
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              borderRadius: "50px",
              bgcolor: `${accentColor}22`,
              border: `1px solid ${accentColor}44`,
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: "10px", fontWeight: 700, color: accentColor, letterSpacing: 1 ,fontFamily: FONT_FAMILY }}>
              PREMIUM SERVICE
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", color: TEXT_PRIMARY, fontFamily: FONT_FAMILY, mb: 1 }}>
            {title}
          </Typography>

          <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", fontFamily: FONT_FAMILY, lineHeight: 1.6 }}>
            {subtitle}
          </Typography>

          {/* ARROW BUTTON DESIGN */}
          <Box
            sx={{
              mt: 3,
              width: 45,
              height: 45,
              borderRadius: "50%",
              border: `1px solid ${accentColor}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "24px auto 0",
              transition: "0.3s",
              color: accentColor,
              "&:hover": {
                bgcolor: accentColor,
                color: "#fff",
              },
            }}
          >
            →
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
};

/* ---------------- MAIN LIST ---------------- */
const ServiceCards: React.FC = () => {
  return (
    <Box sx={{ py: 15, bgcolor: "#020617" }}>
      <Container maxWidth="lg">
        {/* SECTION HEADER */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, fontSize: "0.8rem", mb: 2 ,fontFamily: FONT_FAMILY }}>
            EXCLUSIVE CONCIERGE
          </Typography>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, fontFamily: FONT_FAMILY }}>
            Our Elite Services
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 5,
          }}
        >
          <ServiceCard
            index="01"
            title="VAN DETAILS"
            subtitle="Explore our luxury fleet and personalized seating arrangements."
            accentColor="#38bdf8" // Sky Blue
            image={VAN_IMAGE_URL}
            link="/van-details"
          />

          <ServiceCard
            index="02"
            title="INSTANT BOOKING"
            subtitle="Precision scheduling with real-time location tracking."
            accentColor="#2dd4bf" // Teal
            image={CALENDAR_IMAGE_URL}
            link="/van-booking"
          />

          <ServiceCard
            index="03"
            title="ELITE REQUEST"
            subtitle="Dedicated support for custom routes and special requirements."
            accentColor="#a855f7" // Purple
            image={SPECIAL_REQUEST_IMAGE_URL}
            link="/special-request"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ServiceCards;