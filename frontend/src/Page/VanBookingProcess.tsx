import { Box, Typography, Container, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

/* ---------------- FONT ---------------- */
const MONTSERRAT = '"Montserrat", sans-serif';

/* ---------------- DATA ---------------- */
const steps = [
  {
    title: "Select Van",
    image: "https://cdn-icons-png.flaticon.com/512/3774/3774278.png",
  },
  {
    title: "Choose Date",
    image: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
  },
  {
    title: "Confirm Booking",
    image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  },
  {
    title: "Completed",
    image: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
];

/* ---------------- COMPONENT ---------------- */
const VanBookingProcess = () => {
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [activeStep, setActiveStep] = useState(0);

  /* 🔹 DESKTOP TIME ONLY */
  useEffect(() => {
    if (!isDesktop) return;

    const timer = setInterval(() => {
      setActiveStep((prev) =>
        prev < steps.length - 1 ? prev + 1 : 0
      );
    }, 2200);

    return () => clearInterval(timer);
  }, [isDesktop]);

  const progressPercent = isDesktop
    ? (activeStep / (steps.length - 1)) * 100
    : 0;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#fff",
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="lg">
        {/* TITLE */}
        <Typography
          align="center"
          sx={{
            fontSize: { xs: 20, sm: 24, md: 32 },
            fontWeight: 700,
            mb: { xs: 5, md: 7 },
            fontFamily:MONTSERRAT,
          }}
        >
          How Van Booking Works
        </Typography>

        {/* PROGRESS WRAPPER */}
        <Box sx={{ position: "relative", px: { xs: 1, sm: 3 } }}>
          {/* BASE BAR */}
          <Box
            sx={{
              height: 6,
              borderRadius: 6,
              backgroundColor: "#e5e7eb",
            }}
          />

          {/* ACTIVE BAR – DESKTOP ONLY */}
          {isDesktop && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 6,
                width: `${progressPercent}%`,
                borderRadius: 6,
                background:
                  "linear-gradient(90deg, #06f9f3, #0ea5e9)",
                transition: "width 0.6s ease",
              }}
            />
          )}

          {/* STEPS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: { xs: -24, md: -36 },
              left: 0,
              right: 0,
            }}
          >
            {steps.map((step, index) => {
              const isActive = isDesktop ? index <= activeStep : true;

              return (
                <Box key={index} sx={{ textAlign: "center" }}>
                  {/* CIRCLE */}
                  <Box
                    sx={{
                      width: { xs: 44, sm: 48, md: 80 },
                      height: { xs: 44, sm: 48, md: 80 },
                      mx: "auto",
                      mb: 1.5,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      border: isActive
                        ? "4px solid #06f9f3"
                        : "2px solid #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isActive
                        ? "0 10px 30px rgba(6,249,243,0.45)"
                        : "none",
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Box
                      component="img"
                      src={step.image}
                      alt={step.title}
                      sx={{
                        width: { xs: 22, sm: 24, md: 42 }, // 🔥 BIG IMAGE DESKTOP
                        opacity: isActive ? 1 : 0.5,
                        filter: isActive
                          ? "none"
                          : "grayscale(100%)",
                        transition: "0.3s",
                      }}
                    />
                  </Box>

                  {/* LABEL */}
                  <Typography
                    sx={{
                      fontSize: { xs: 11, sm: 12, md: 15 },
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#0f172a" : "#64748b",
                      whiteSpace: "nowrap",
                      fontFamily:MONTSERRAT, 
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VanBookingProcess;
