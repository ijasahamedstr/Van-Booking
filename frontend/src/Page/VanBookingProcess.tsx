import { Box, Typography, Container } from "@mui/material";
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
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) =>
        prev < steps.length - 1 ? prev + 1 : 0
      );
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  const progressPercent =
    (activeStep / (steps.length - 1)) * 100;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: "#fff",
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="lg">
        {/* TITLE */}
        <Typography
          align="center"
          sx={{
            fontSize: { xs: 22, md: 32 },
            fontWeight: 900,
            mb: 6,
          }}
        >
          How Van Booking Works
        </Typography>

        {/* PROGRESS BAR WRAPPER */}
        <Box sx={{ position: "relative", px: 2 }}>
          {/* BASE BAR */}
          <Box
            sx={{
              height: 6,
              borderRadius: 6,
              background: "#e5e7eb",
            }}
          />

          {/* ACTIVE BAR */}
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

          {/* STEPS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: -28,
              left: 0,
              right: 0,
            }}
          >
            {steps.map((step, index) => {
              const isActive = index <= activeStep;

              return (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    width: "0%",
                  }}
                >
                  {/* ROUND STEP */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      mx: "auto",
                      mb: 1,
                      borderRadius: "50%",
                      background: "#fff",
                      border: isActive
                        ? "3px solid #06f9f3"
                        : "2px solid #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isActive
                        ? "0 10px 25px rgba(6,249,243,0.35)"
                        : "none",
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Box
                      component="img"
                      src={step.image}
                      alt={step.title}
                      sx={{
                        width: 26,
                        filter: isActive
                          ? "none"
                          : "grayscale(100%)",
                        opacity: isActive ? 1 : 0.6,
                        transition: "0.3s",
                      }}
                    />
                  </Box>

                  {/* LABEL */}
                  <Typography
                    sx={{
                      fontSize: { xs: 11, md: 14 },
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#0f172a" : "#64748b",
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
