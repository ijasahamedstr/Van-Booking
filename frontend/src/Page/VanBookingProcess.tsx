import { Box, Typography, Container } from "@mui/material";
import { keyframes } from "@mui/system";

/* ---------------- FONT ---------------- */

const TAJAWAL = "cursive";

/* ---------------- ANIMATIONS ---------------- */

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
`;

/* ---------------- DATA ---------------- */

const steps = [
  {
    title: "Select Van",
    icon: "https://cdn-icons-png.flaticon.com/512/3774/3774278.png",
  },
  {
    title: "Choose Date",
    icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
  },
  {
    title: "Confirm Booking",
    icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  },
  {
    title: "Completed",
    icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
];

/* ---------------- COMPONENT ---------------- */

const VanBookingProcess = () => {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background: "#fff",
        fontFamily: TAJAWAL,
      }}
    >
      <Container maxWidth="xl">
        {/* TITLE */}
        <Typography
          align="center"
          sx={{
            fontFamily: TAJAWAL,
            fontSize: { xs: 22, md: 30, lg: 32 },
            fontWeight: 800,
            mb: { xs: 4, md: 6 },
          }}
        >
          How Van Booking Works
        </Typography>

        {/* ONE ROW */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2.5, md: 4 },
            perspective: "1000px",
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                textAlign: "center",
                fontFamily: TAJAWAL,
              }}
            >
              {/* 3D ICON CARD */}
              <Box
                sx={{
                  width: { xs: 58, sm: 64, md: 82, lg: 90 },
                  height: { xs: 58, sm: 64, md: 82, lg: 90 },
                  mx: "auto",
                  mb: { xs: 1, md: 1.6 },
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, #ffffff, #e6f7f6)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.15), inset 0 -3px 6px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${float} 3s ease-in-out infinite`,
                  transition: "all 0.35s ease",
                  transformStyle: "preserve-3d",
                  "&:hover": {
                    transform:
                      "translateY(-6px) rotateX(8deg) rotateY(-8deg)",
                    boxShadow:
                      "0 18px 35px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={step.icon}
                  alt={step.title}
                  sx={{
                    width: { xs: 26, sm: 30, md: 40, lg: 44 },
                    transform: "translateZ(20px)",
                  }}
                />
              </Box>

              {/* TEXT */}
              <Typography
                sx={{
                  fontFamily: TAJAWAL,
                  fontWeight: 600,
                  fontSize: { xs: 11, sm: 12, md: 14, lg: 15 },
                  lineHeight: 1.25,
                }}
              >
                {step.title}
              </Typography>

              {/* CONNECTOR ARROW */}
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "38%",
                    right: { xs: -12, sm: -18, md: -28, lg: -36 },
                    width: { xs: 24, sm: 34, md: 56, lg: 70 },
                    height: 3,
                    background:
                      "linear-gradient(90deg, #0f766e, #06f9f3)",
                    borderRadius: 10,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -10,
                      top: -6,
                      borderLeft: "12px solid #06f9f3",
                      borderTop: "7px solid transparent",
                      borderBottom: "7px solid transparent",
                    },
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default VanBookingProcess;
