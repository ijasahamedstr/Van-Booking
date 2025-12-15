import { Box, Typography, Container } from "@mui/material";
import { keyframes } from "@mui/system";

/* ---------------- ANIMATION ---------------- */

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
    <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: "#fff" }}>
      <Container maxWidth="xl">
        {/* TITLE */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: { xs: 4, md: 6 },
            fontFamily: "Montserrat, sans-serif",
            textShadow: "0 2px 12px rgba(6,249,243,0.35)",
          }}
        >
          How Van Booking Works
        </Typography>

        {/* PROCESS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)", // 🔑 one row always
            alignItems: "center",
            gap: { xs: 1.5, sm: 2, md: 0 },
            position: "relative",
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* ICON */}
              <Box
                sx={{
                  width: { xs: 56, sm: 68, md: 90 },
                  height: { xs: 56, sm: 68, md: 90 },
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
                  sx={{
                    width: { xs: 22, sm: 26, md: 38 },
                    height: "auto",
                  }}
                />
              </Box>

              {/* TEXT */}
              <Typography
                sx={{
                  mt: 1.2,
                  fontWeight: 600,
                  fontSize: { xs: 11, sm: 13, md: 15 },
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: 1.2,
                }}
              >
                {step.title}
              </Typography>

              {/* CONNECTOR */}
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 28, sm: 34, md: 45 },
                    right: "-50%",
                    width: "100%",
                    height: "2px",
                    borderTop: "2px dashed #A5D6A7",
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
