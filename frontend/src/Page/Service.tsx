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

const TAJAWAL = "cursive";

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
  100% { transform: scale(.97); }
`;

const float = keyframes`
  0% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -16px); }
  100% { transform: translate(-50%, 0); }
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
    <Box sx={{ position: "relative", pt: 14, fontFamily: TAJAWAL }}>
      {/* FLOATING IMAGE */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: 220,
          maxWidth: "90%",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          animation: `${float} 4s ease-in-out infinite`,
          filter: "drop-shadow(0 30px 45px rgba(0,0,0,.55))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* CARD */}
      <Card
        sx={{
          borderRadius: 6,
          background: gradient,
          color: "#fff",
          boxShadow: "0 28px 60px rgba(0,0,0,.32)",
          fontFamily: TAJAWAL,
        }}
      >
        <CardActionArea
          component={Link}
          to={link}
          sx={{
            pt: 10,
            pb: 4,
            px: 3,
            textAlign: "center",
            fontFamily: TAJAWAL,
            textDecoration: "none",
            color: "inherit",
            "&:active": {
              animation: `${tap} .12s ease-in-out`,
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 19,
              fontFamily: TAJAWAL,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              opacity: 0.9,
              mt: 0.8,
              fontFamily: TAJAWAL,
            }}
          >
            {subtitle}
          </Typography>

          <Typography
            sx={{
              fontSize: 26,
              mt: 1.2,
              fontFamily: TAJAWAL,
            }}
          >
            →
          </Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
};

/* ---------------- MAIN LIST ---------------- */

const ServiceCards: React.FC = () => {
  return (
    <Box sx={{ py: 8, fontFamily: TAJAWAL }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 6,
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
