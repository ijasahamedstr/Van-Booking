import { Box, Typography, Container } from "@mui/material";
import { keyframes } from "@mui/system";

/* ---------------- FONT ---------------- */
const MONTSERRAT = '"Montserrat", sans-serif';

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
    title: "Date",
    icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
  },
  {
    title: "Booking",
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
        pt: { xs: 5, md: 7 },
        pb: 0,
        background: "#fff",
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="xl">
        {/* TITLE */}
        <Typography
          align="center"
          sx={{
            fontFamily: MONTSERRAT,
            fontSize: { xs: 22, md: 30, lg: 32 },
            fontWeight: 800,
            mb: { xs: 4, md: 6 },
          }}
        >
          How Van Booking Works
        </Typography>

        {/* STEPS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2.5, md: 4 },
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                textAlign: "center",
                fontFamily: MONTSERRAT,
              }}
            >
              {/* ICON CARD (UNCHANGED) */}
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
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={step.icon}
                  alt={step.title}
                  sx={{
                    width: { xs: 26, sm: 30, md: 40, lg: 44 },
                  }}
                />
              </Box>

              {/* TEXT */}
              <Typography
                sx={{
                  fontFamily: MONTSERRAT,
                  fontWeight: 600,
                  fontSize: { xs: 11, sm: 12, md: 14, lg: 15 },
                }}
              >
                {step.title}
              </Typography>

              {/* ✅ UPDATED ARROW CONNECTOR (ONLY THIS PART CHANGED) */}
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "42%",
                    right: { xs: -18, sm: -26, md: -38, lg: -48 },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* LINE */}
                  <Box
                    sx={{
                      width: { xs: 26, sm: 40, md: 60, lg: 75 },
                      height: 3,
                      borderRadius: 6,
                      background:
                        "linear-gradient(90deg, #cbd5e1, #06f9f3)",
                    }}
                  />

                  {/* ARROW HEAD */}
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderLeft: "10px solid #06f9f3",
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default VanBookingProcess;
