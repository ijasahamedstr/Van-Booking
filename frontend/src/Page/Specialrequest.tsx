import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  InputAdornment,
  Stack,
  Stepper,
  Step,
  StepLabel,
  styled,
  alpha
} from "@mui/material";
import { keyframes } from "@emotion/react";
import Swal from "sweetalert2";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/* ---------------- CONSTANTS ---------------- */
const API_HOST = import.meta.env.VITE_API_HOST as string;
const MONTSERRAT = '"Montserrat", sans-serif';
const ACCENT_COLOR = "#0ea5e9";
const HEADER_GREEN = "#004d40"; 

/* ---------------- ANIMATIONS ---------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ---------------- STYLED COMPONENTS ---------------- */
const ModernTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    fontFamily: MONTSERRAT,
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: ACCENT_COLOR,
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: `0 0 0 4px ${alpha(ACCENT_COLOR, 0.2)}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: ACCENT_COLOR,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: MONTSERRAT,
    fontSize: "0.85rem",
    fontWeight: 500,
  },
});

const steps = ['Basic Info', 'Request Details', 'Review & Send'];

const RequestForm: React.FC = () => {
  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    requestType: "",
    bookingDate: "",
    van: "",
    seatNumber: "",
    description: "",
    emergencyReason: "",
    emergencyArea: "",
  });

  const [vanList, setVanList] = useState<string[]>([]);
  const [activeStep] = useState(1); 

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch(`${API_HOST}/Vanaddinfo`);
        const data = await res.json();
        setVanList(Array.isArray(data) ? data.map((v: any) => v.vanname) : []);
      } catch {
        console.error("Failed to load vans");
      }
    };
    fetchVans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isEmergency = form.requestType === "Emergency Service";
  const showExtraFields = [
    "Van Not Available – Need Full Booking", 
    "Van For Event Booking", 
    "Cancel Full Booking", 
    "Cancel Seat Booking"
  ].includes(form.requestType);

  const handleSubmit = async () => {
    Swal.fire({
      title: 'Processing Request...',
      text: 'Connecting to secure server',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    
    // Your submission logic here...
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        /* Substantial Top Padding for spacing */
        pt: { xs: 10, md: 20 }, 
        pb: 10,
        background: "radial-gradient(circle at 50% -10%, #1e293b 0%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ animation: `${fadeIn} 0.8s ease-out` }}>
        
        {/* PROGRESS STEPPER */}
        <Box sx={{ mb: 6, width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontFamily: MONTSERRAT,
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.75rem',
                      '&.Mui-active': { color: ACCENT_COLOR, fontWeight: 700 },
                      '&.Mui-completed': { color: '#fff' }
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(255,255,255,0.15)',
                      '&.Mui-active': { color: ACCENT_COLOR },
                      '&.Mui-completed': { color: '#10b981' }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper
          elevation={24}
          sx={{
            borderRadius: "28px",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 50px 100px -20px rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          {/* OFFICIAL GREEN HEADER */}
          <Box
            sx={{
              bgcolor: HEADER_GREEN,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AssignmentIcon sx={{ color: "#fff", fontSize: 28 }} />
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: MONTSERRAT,
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  letterSpacing: "0.5px",
                  lineHeight: 1.2
                }}
              >
                REQUEST PORTAL
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1 }}>
                STEP 02: APPLICATION INTENT
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <ModernTextField
                  fullWidth
                  label="Customer Name"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: ACCENT_COLOR, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <ModernTextField
                  fullWidth
                  label="Mobile No."
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon sx={{ color: ACCENT_COLOR, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <ModernTextField
                select
                fullWidth
                label="Nature of Request"
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
              >
                {[
                  "Van Not Available – Need Full Booking", 
                  "Van For Event Booking", 
                  "Cancel Full Booking", 
                  "Cancel Seat Booking", 
                  "Emergency Service"
                ].map((type) => (
                  <MenuItem key={type} value={type} sx={{ fontFamily: MONTSERRAT, fontSize: '0.85rem' }}>
                    {type}
                  </MenuItem>
                ))}
              </ModernTextField>

              {showExtraFields && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ animation: `${fadeIn} 0.5s ease` }}>
                  <ModernTextField
                    type="date"
                    fullWidth
                    label="Booking Date"
                    name="bookingDate"
                    value={form.bookingDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <ModernTextField
                    select
                    fullWidth
                    label="Assigned Van"
                    name="van"
                    value={form.van}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsBusIcon sx={{ color: ACCENT_COLOR, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {vanList.map((van) => (
                      <MenuItem key={van} value={van} sx={{ fontFamily: MONTSERRAT }}>{van}</MenuItem>
                    ))}
                  </ModernTextField>
                </Stack>
              )}

              {isEmergency && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ animation: `${fadeIn} 0.5s ease` }}>
                  <ModernTextField fullWidth label="Emergency Reason" name="emergencyReason" value={form.emergencyReason} onChange={handleChange} />
                  <ModernTextField 
                    fullWidth 
                    label="Area / City" 
                    name="emergencyArea" 
                    value={form.emergencyArea}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: ACCENT_COLOR, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              )}

              <ModernTextField
                fullWidth
                multiline
                rows={3}
                label="Detailed Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter specific details regarding your request..."
              />

              <Divider sx={{ my: 1, opacity: 0.5 }} />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  py: 2.2,
                  borderRadius: "18px",
                  fontFamily: MONTSERRAT,
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  textTransform: "none",
                  letterSpacing: '0.5px',
                  background: `linear-gradient(135deg, ${HEADER_GREEN} 0%, #002d26 100%)`,
                  boxShadow: `0 12px 30px -5px ${alpha(HEADER_GREEN, 0.5)}`,
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 40px -5px ${alpha(HEADER_GREEN, 0.6)}`,
                    background: `linear-gradient(135deg, #00695c 0%, ${HEADER_GREEN} 100%)`,
                  },
                  "&:active": {
                    transform: "scale(0.98)"
                  }
                }}
              >
                PROCEED & NOTIFY VIA WHATSAPP
              </Button>
            </Stack>
          </Box>
        </Paper>
        
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 5, textAlign: 'center', width: '100%', display: 'block', fontFamily: MONTSERRAT, letterSpacing: 1.5 }}>
          SECURE ENCRYPTED CHANNEL • © 2026 VAN SERVICES
        </Typography>
      </Container>
    </Box>
  );
};

export default RequestForm;