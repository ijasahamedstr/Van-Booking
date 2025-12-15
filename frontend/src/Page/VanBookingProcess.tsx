import { Box, Typography, Container } from "@mui/material";
import { keyframes } from "@mui/system";

/* ---------------- ANIMATION ---------------- */

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
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
    title: "Van on the Way",
    icon: "https://cdn-icons-png.flaticon.com/512/1048/1048313.png",
  },
  {
    title: "Trip Completed",
    icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
];

/* ---------------- COMPONENT ---------------- */

const VanBookingProcess = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#fff" }}>
      <Container maxWidth="xl">
        {/* TITLE */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 6,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          How Van Booking Works
        </Typography>

        {/* PROCESS */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: { xs: 4, md: 0 },
            position: "relative",
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: "18%" },
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* ICON CIRCLE */}
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  mx: "auto",
                  borderRadius: "50%",
                  backgroundColor: "#E8F5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: `${float} 3s ease-in-out infinite`,
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#C8E6C9",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={step.icon}
                  sx={{ width: 42, height: 42 }}
                />
              </Box>

              {/* TEXT */}
              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {step.title}
              </Typography>

              {/* CONNECTOR */}
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 45,
                    right: { sm: "-50%" },
                    width: { sm: "100%" },
                    height: "2px",
                    borderTop: "2px dashed #A5D6A7",
                    display: { xs: "none", sm: "block" },
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
