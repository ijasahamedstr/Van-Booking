import { useState, useEffect } from "react";
import { Box, Typography, Container, Stack, alpha } from "@mui/material";
import { keyframes } from "@emotion/react";
// Material UI Icons
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShieldCheckeredIcon from '@mui/icons-material/Shield';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

/* ---------------- CONSTANTS ---------------- */
const THEME_COLOR = "#0f172a"; 
const ACCENT_COLOR = "#6366f1"; 
const SYSTEM_FONT = '"Montserrat", sans-serif';

const steps = [
  { 
    title: "Select Your Fleet", 
    tagline: "EXECUTIVE COMFORT",
    desc: "Choose from our curated selection of luxury Sprinters and transit vans equipped with Wi-Fi.",
    icon: <DirectionsCarFilledIcon /> 
  },
  { 
    title: "Reserve the Date", 
    tagline: "PRECISION TIMING",
    desc: "Our real-time scheduling engine ensures your chauffeur is ready exactly when you need them.",
    icon: <CalendarMonthIcon /> 
  },
  { 
    title: "Secure Payment", 
    tagline: "TOTAL PROTECTION",
    desc: "Experience peace of mind with our military-grade encrypted payment gateway and digital invoicing.",
    icon: <ShieldCheckeredIcon /> 
  },
  { 
    title: "Ready for Departure", 
    tagline: "VIP ARRIVAL",
    desc: "Receive your driver's profile, vehicle tracking link, and concierge contact details via SMS.",
    icon: <FlightTakeoffIcon /> 
  },
];

/* ---------------- ANIMATIONS ---------------- */
const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); filter: blur(8px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`;

const progressLoader = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

/* ---------------- COMPONENT ---------------- */
const ImmersiveBookingWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      bgcolor: "#fcfcfd", 
      display: "flex", 
      alignItems: "center",
      fontFamily: SYSTEM_FONT,
      color: THEME_COLOR,
      py: 4,
      pt: 12,
      pb: 1+2,
    }}>
      <Container maxWidth="md">
        <Stack direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center">
          
          {/* NAVIGATION (LEFT) */}
          <Box sx={{ width: { xs: "100%", md: "45%" } }}>
            <Stack spacing={1.5}>
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <Box 
                    key={index}
                    onClick={() => setActiveStep(index)}
                    sx={{ 
                      p: 2,
                      cursor: "pointer",
                      transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderRadius: "16px",
                      position: "relative",
                      bgcolor: isActive ? alpha(ACCENT_COLOR, 0.06) : "transparent",
                      "&:hover": { bgcolor: !isActive ? alpha(THEME_COLOR, 0.02) : null }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Nav Icon */}
                      <Box sx={{ 
                        color: isActive ? ACCENT_COLOR : alpha(THEME_COLOR, 0.2),
                        display: "flex",
                        "& svg": { fontSize: "1.4rem" },
                        transition: "0.3s"
                      }}>
                        {step.icon}
                      </Box>

                      <Box>
                        <Typography sx={{ 
                          fontSize: "0.6rem", 
                          fontWeight: 800, 
                          color: isActive ? ACCENT_COLOR : "#94a3b8",
                          letterSpacing: 1.2,
                          mb: 0.2,
                          fontFamily: SYSTEM_FONT
                        }}>
                          PHASE 0{index + 1}
                        </Typography>
                        
                        <Typography sx={{ 
                          fontSize: "0.95rem", 
                          fontWeight: 600, 
                          color: isActive ? THEME_COLOR : alpha(THEME_COLOR, 0.45),
                          fontFamily: SYSTEM_FONT,
                        }}>
                          {step.title}
                        </Typography>
                      </Box>
                    </Stack>

                    {isActive && (
                      <Box sx={{ 
                        position: "absolute", 
                        bottom: 0, left: 16, right: 16,
                        height: "2px",
                        bgcolor: alpha(ACCENT_COLOR, 0.1),
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}>
                        <Box sx={{ 
                          height: "100%", 
                          bgcolor: ACCENT_COLOR, 
                          animation: `${progressLoader} 5s linear infinite` 
                        }} />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* DISPLAY CARD (RIGHT) */}
          <Box sx={{ width: { xs: "100%", md: "55%" } }}>
            <Box
              key={activeStep} 
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: "30px",
                bgcolor: THEME_COLOR,
                color: "#fff",
                boxShadow: `0 30px 60px ${alpha(THEME_COLOR, 0.2)}`,
                animation: `${fadeInRight} 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Stack spacing={3}>
                {/* Large Display Icon */}
                <Box sx={{ 
                  width: 54, height: 54, 
                  bgcolor: alpha(ACCENT_COLOR, 0.2), 
                  color: ACCENT_COLOR,
                  borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  "& svg": { fontSize: "2rem" } 
                }}>
                  {steps[activeStep].icon}
                </Box>

                <Box>
                  <Typography sx={{ 
                    color: ACCENT_COLOR, 
                    fontWeight: 700, 
                    fontSize: "0.7rem", 
                    letterSpacing: 2,
                    mb: 1,
                    fontFamily: SYSTEM_FONT
                  }}>
                    {steps[activeStep].tagline}
                  </Typography>
                  
                  <Typography sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    fontFamily: SYSTEM_FONT,
                    fontSize: { xs: "1.5rem", md: "1.8rem" },
                    lineHeight: 1.2
                  }}>
                    {steps[activeStep].title}
                  </Typography>

                  <Typography sx={{ 
                    color: alpha("#fff", 0.6), 
                    fontSize: "0.9rem", 
                    lineHeight: 1.7,
                    fontFamily: SYSTEM_FONT,
                    fontWeight: 400
                  }}>
                    {steps[activeStep].desc}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "pointer",
                  gap: 1.5,
                  mt: 1,
                  "&:hover": { 
                    color: ACCENT_COLOR,
                    "& span": { transform: "translateX(4px)" }
                  }
                }}>
                  EXPLORE FEATURE <span style={{ transition: "0.2s" }}>→</span>
                </Box>
              </Stack>
            </Box>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
};

export default ImmersiveBookingWorkflow;