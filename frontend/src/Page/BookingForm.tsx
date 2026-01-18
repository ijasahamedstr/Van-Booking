/**
 * =================================================================================================
 * PROJECT: CLICKLANKA / ADVANCED VAN BOOKING SYSTEM
 * COMPONENT: RequestForm (Version 2.0 - Extended Production Code)
 * FEATURES: Multi-Day Trip Support, Smart Van Filtering, Interactive Seat Map, High-Fidelity UI
 * AUTHOR: Gemini AI
 * DATE: 2026-01-18
 * =================================================================================================
 */

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// --- MATERIAL UI CORE ---
import {
  Box, TextField, MenuItem, Button, Typography, Container, Card, CardActionArea,
  CardMedia, CardContent, Dialog, DialogContent, DialogTitle, DialogActions,
  Paper, InputAdornment, Stack, Fade, Slide, useTheme, useMediaQuery,
  CircularProgress, IconButton, Divider, Stepper, Step, StepLabel, Skeleton,
  Alert, Tooltip, Drawer, Chip, Avatar, LinearProgress, ToggleButtonGroup, ToggleButton,
} from "@mui/material";

// --- MATERIAL UI ICONS ---
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PublicIcon from "@mui/icons-material/Public";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import DateRangeIcon from "@mui/icons-material/DateRange";
import InfoIcon from "@mui/icons-material/Info";

/* =================================================================================================
 * 1. CONFIGURATION & THEME SYSTEM
 * ================================================================================================= */

const API_HOST = import.meta.env.VITE_API_HOST as string;
const TODAY_DATE = new Date().toISOString().split("T")[0];

const PALETTE = {
  primary: { main: "#4f46e5", dark: "#4338ca", light: "#e0e7ff" },
  secondary: { main: "#06b6d4", light: "#cffafe" },
  status: { success: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" },
  ui: { bg: "#f8fafc", paper: "#ffffff", border: "#e2e8f0", inputBg: "#f1f5f9", textMain: "#0f172a", textMuted: "#64748b" },
  seat: { booked: "#ef4444", selected: "#4f46e5", available: "#ffffff", border: "#cbd5e1" },
};

const FONTS = { PRIMARY: '"Montserrat", sans-serif', SECONDARY: '"Roboto", sans-serif' };

const INPUT_SX = {
  "& .MuiFilledInput-root": {
    backgroundColor: PALETTE.ui.inputBg,
    borderRadius: "16px",
    fontFamily: FONTS.PRIMARY,
    border: "2px solid transparent",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:before, &:after": { display: "none" },
    "&:hover": { backgroundColor: "#e2e8f0" },
    "&.Mui-focused": { backgroundColor: "#ffffff", borderColor: PALETTE.primary.main, boxShadow: `0 0 0 4px ${PALETTE.primary.light}` },
    "&.Mui-error": { backgroundColor: "#fef2f2", borderColor: PALETTE.status.error },
  },
  "& .MuiInputLabel-root": { fontFamily: FONTS.PRIMARY, color: PALETTE.ui.textMuted, fontWeight: 500 },
};

/* =================================================================================================
 * 2. TYPES & INTERFACES
 * ================================================================================================= */

interface Van {
  _id: string;
  vanname: string;
  Image: string[];
  seatType: "14" | "11";
  bookingStatus?: "AVAILABLE" | "PARTIAL" | "FULL";
}

interface SeatPosition { number: number; top: string; left: string; }

interface BookingFormState {
  customerName: string;
  mobileNumber: string;
  tripType: "single" | "multi";
  bookingDate: string; 
  returnDate: string;
  bookingCategory: string;
  country: string;
  arrivalTime: string;
  arrivalMode: string;
  van: string;
  seatNumber: string;
  ticketFile: File | null;
}

/* =================================================================================================
 * 3. DATA & LAYOUTS
 * ================================================================================================= */

const LAYOUTS = {
  SEATS_14: [
    { number: 1, top: "24%", left: "18%" }, { number: 2, top: "24%", left: "30%" },
    { number: 3, top: "24%", left: "42%" }, { number: 4, top: "24%", left: "54%" },
    { number: 5, top: "36%", left: "18%" }, { number: 6, top: "36%", left: "30%" },
    { number: 7, top: "36%", left: "42%" }, { number: 8, top: "36%", left: "54%" },
    { number: 9, top: "48%", left: "18%" }, { number: 10, top: "48%", left: "30%" },
    { number: 11, top: "48%", left: "42%" }, { number: 12, top: "48%", left: "54%" },
    { number: 13, top: "60%", left: "18%" }, { number: 14, top: "24%", left: "74%" },
  ],
  SEATS_11: [
    { number: 1, top: "24%", left: "22%" }, { number: 2, top: "24%", left: "34%" },
    { number: 3, top: "24%", left: "46%" }, { number: 4, top: "36%", left: "22%" },
    { number: 5, top: "36%", left: "34%" }, { number: 6, top: "36%", left: "46%" },
    { number: 7, top: "48%", left: "22%" }, { number: 8, top: "48%", left: "34%" },
    { number: 9, top: "48%", left: "46%" }, { number: 10, top: "60%", left: "22%" },
    { number: 11, top: "24%", left: "74%" },
  ]
};

const CATEGORIES = ["Full Booking", "Seat Booking", "Booking from Abroad"];
const STEPS = ["Route Info", "Vehicle Selection", "Choose Seat", "Confirmation"];

/* =================================================================================================
 * 4. REUSABLE UI COMPONENTS
 * ================================================================================================= */

const CustomStatusBadge = memo(({ status }: { status?: string }) => {
  const isPartial = status === "PARTIAL";
  return (
    <Chip
      icon={isPartial ? <AccessTimeIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
      label={isPartial ? "Filling Fast" : "Available"}
      size="small"
      sx={{
        bgcolor: isPartial ? PALETTE.status.warning : PALETTE.status.success,
        color: "#fff",
        fontWeight: 800,
        textTransform: "uppercase",
        fontSize: "0.65rem",
        px: 1,
      }}
    />
  );
});

/* =================================================================================================
 * 5. MAIN CONTROLLER
 * ================================================================================================= */

const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // --- Initial State ---
  const [form, setForm] = useState<BookingFormState>({
    customerName: "", mobileNumber: "", tripType: "single",
    bookingDate: TODAY_DATE, returnDate: "", bookingCategory: "",
    country: "", arrivalTime: "", arrivalMode: "fullVan", van: "",
    seatNumber: "", ticketFile: null,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [vanList, setVanList] = useState<Van[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // --- Core Logic ---
  const selectedVan = useMemo(() => vanList.find(v => v.vanname === form.van), [vanList, form.van]);

  const fetchVans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_HOST}/Vanaddinfo?date=${form.bookingDate}`);
      const data = await res.json();
      setVanList(Array.isArray(data) ? data.filter(v => v.bookingStatus !== "FULL") : []);
    } catch (e) { console.error("API Error", e); }
    finally { setLoading(false); }
  }, [form.bookingDate]);

  useEffect(() => { if (activeStep === 1) fetchVans(); }, [activeStep, fetchVans]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev: any) => ({ ...prev, [e.target.name]: null }));
  };

  const handleStepValidation = () => {
    const err: any = {};
    if (activeStep === 0) {
      if (!form.customerName) err.customerName = "Name required";
      if (!form.mobileNumber) err.mobileNumber = "Contact required";
      if (!form.bookingCategory) err.bookingCategory = "Type required";
      if (form.tripType === "multi" && !form.returnDate) err.returnDate = "End date required";
    }
    if (activeStep === 1 && !form.van) { Swal.fire("Required", "Select a vehicle", "info"); return false; }
    if (activeStep === 2 && form.bookingCategory === "Seat Booking" && !form.seatNumber) {
       Swal.fire("Required", "Pick a seat", "info"); return false;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => handleStepValidation() && setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => s - 1);

  const finalSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_HOST}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        Swal.fire("Success", "Booking Registered", "success").then(() => navigate("/"));
      }
    } catch (e) { Swal.fire("Error", "Server Connection Failed", "error"); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: PALETTE.ui.bg, py: { xs: 2, md: 5 } }}>
      <Container maxWidth="xl">
        
        {/* Header Summary for Mobile */}
        {isMobile && activeStep > 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            Booking for {form.customerName || "Guest"} on {form.bookingDate}
          </Alert>
        )}

        <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
          
          {/* Main Card */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper elevation={0} sx={{ borderRadius: "32px", border: `1px solid ${PALETTE.ui.border}`, overflow: "hidden" }}>
              
              {/* Progress Indicator */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${PALETTE.ui.border}`, bgcolor: "#fff" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {STEPS.map(label => (
                    <Step key={label}><StepLabel><Typography variant="caption" fontWeight={700}>{label}</Typography></StepLabel></Step>
                  ))}
                </Stepper>
                <LinearProgress variant="determinate" value={(activeStep / 3) * 100} sx={{ mt: 3, height: 6, borderRadius: 3, bgcolor: PALETTE.ui.inputBg }} />
              </Box>

              <Box sx={{ p: { xs: 3, md: 6 }, minHeight: 500 }}>
                {/* STEP 0: ROUTE & USER INFO */}
                {activeStep === 0 && (
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="h5" fontWeight={900} fontFamily={FONTS.PRIMARY}>Trip Duration</Typography>
                      <ToggleButtonGroup
                        value={form.tripType}
                        exclusive
                        onChange={(_, val) => val && setForm(p => ({ ...p, tripType: val }))}
                        fullWidth
                        sx={{ mt: 2, bgcolor: PALETTE.ui.inputBg, p: 0.5, borderRadius: "16px" }}
                      >
                        <ToggleButton value="single" sx={{ border: "none", borderRadius: "12px", py: 1.5, fontWeight: 700, textTransform: "none" }}>
                          <CalendarTodayIcon sx={{ mr: 1 }} /> Single Day
                        </ToggleButton>
                        <ToggleButton value="multi" sx={{ border: "none", borderRadius: "12px", py: 1.5, fontWeight: 700, textTransform: "none" }}>
                          <DateRangeIcon sx={{ mr: 1 }} /> Multi-Day Trip
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Divider />

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                      <TextField label="Full Name" name="customerName" variant="filled" sx={INPUT_SX} value={form.customerName} onChange={handleInputChange} error={!!errors.customerName} helperText={errors.customerName} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
                      <TextField label="Phone Number" name="mobileNumber" variant="filled" sx={INPUT_SX} value={form.mobileNumber} onChange={handleInputChange} error={!!errors.mobileNumber} helperText={errors.mobileNumber} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }} />
                      
                      <TextField type="date" label="Departure Date" name="bookingDate" variant="filled" sx={INPUT_SX} value={form.bookingDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} inputProps={{ min: TODAY_DATE }} />
                      {form.tripType === "multi" && (
                        <Fade in>
                          <TextField type="date" label="Return Date" name="returnDate" variant="filled" sx={INPUT_SX} value={form.returnDate} onChange={handleInputChange} error={!!errors.returnDate} helperText={errors.returnDate} InputLabelProps={{ shrink: true }} inputProps={{ min: form.bookingDate }} />
                        </Fade>
                      )}
                    </Box>

                    <TextField select label="Booking Type" name="bookingCategory" variant="filled" sx={INPUT_SX} value={form.bookingCategory} onChange={handleInputChange} error={!!errors.bookingCategory}>
                      {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600 }}>{c}</MenuItem>)}
                    </TextField>
                  </Stack>
                )}

                {/* STEP 1: VEHICLE SELECTION */}
                {activeStep === 1 && (
                  <Stack spacing={4}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={900}>Select Your Van</Typography>
                      <IconButton onClick={fetchVans} color="primary"><RestartAltIcon /></IconButton>
                    </Box>

                    {loading ? (
                      <Stack direction="row" spacing={3}>{ [1,2,3].map(i => <Skeleton key={i} variant="rectangular" width="30%" height={200} sx={{ borderRadius: 4 }} />) }</Stack>
                    ) : (
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
                        {vanList.map(v => (
                          <Card key={v._id} sx={{ borderRadius: "24px", border: form.van === v.vanname ? `2px solid ${PALETTE.primary.main}` : `1px solid ${PALETTE.ui.border}`, bgcolor: form.van === v.vanname ? PALETTE.primary.light : "#fff" }}>
                            <CardActionArea onClick={() => setForm(p => ({ ...p, van: v.vanname }))} sx={{ p: 2 }}>
                               <Box sx={{ mb: 1 }}><CustomStatusBadge status={v.bookingStatus} /></Box>
                               <CardMedia component="img" image={v.Image?.[0]} sx={{ height: 120, objectFit: "contain", my: 2 }} />
                               <Typography variant="subtitle1" fontWeight={800} textAlign="center">{v.vanname}</Typography>
                               <Typography variant="caption" color="text.secondary" display="block" textAlign="center">{v.seatType} Seats • Diesel • A/C</Typography>
                            </CardActionArea>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Stack>
                )}

                {/* STEP 2: SEAT MAP */}
                {activeStep === 2 && (
                  <Stack spacing={4} alignItems="center">
                    <Typography variant="h5" fontWeight={900}>Choose Preferred Seat</Typography>
                    {form.bookingCategory === "Full Booking" ? (
                      <Box sx={{ p: 4, bgcolor: PALETTE.secondary.light, borderRadius: 6, textAlign: "center", maxWidth: 500 }}>
                        <VerifiedUserIcon sx={{ fontSize: 60, color: PALETTE.secondary.main, mb: 2 }} />
                        <Typography variant="h6" fontWeight={800}>Full Vehicle Reserved</Typography>
                        <Typography variant="body2" color="text.secondary">You are booking the entire van. Individual seat selection is not required as the whole vehicle is yours.</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ width: "100%", maxWidth: 400, p: 3, bgcolor: "#fff", borderRadius: 8, border: `1px solid ${PALETTE.ui.border}` }}>
                         <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mb={2}>Tap on a seat number to select</Typography>
                         <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                            {Array.from({ length: selectedVan?.seatType === "14" ? 14 : 11 }, (_, i) => (
                              <Button
                                key={i}
                                variant={form.seatNumber === (i + 1).toString() ? "contained" : "outlined"}
                                onClick={() => setForm(p => ({ ...p, seatNumber: (i + 1).toString() }))}
                                sx={{ borderRadius: "10px", minWidth: 0, height: 45, fontWeight: 700 }}
                              >
                                {i + 1}
                              </Button>
                            ))}
                         </Box>
                      </Box>
                    )}
                  </Stack>
                )}

                {/* STEP 3: FINAL REVIEW */}
                {activeStep === 3 && (
                  <Stack spacing={4}>
                    <Typography variant="h5" fontWeight={900}>Final Review</Typography>
                    <Box sx={{ p: 4, bgcolor: "#fff", borderRadius: 6, border: `2px dashed ${PALETTE.primary.main}` }}>
                        <Stack spacing={2}>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography color="text.secondary" fontWeight={600}>Passenger:</Typography>
                              <Typography fontWeight={800}>{form.customerName}</Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography color="text.secondary" fontWeight={600}>Trip Type:</Typography>
                              <Typography fontWeight={800} color="primary">{form.tripType === "single" ? "One Way" : "Round Trip"}</Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography color="text.secondary" fontWeight={600}>Dates:</Typography>
                              <Typography fontWeight={800}>{form.bookingDate} {form.returnDate && `to ${form.returnDate}`}</Typography>
                           </Box>
                           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography color="text.secondary" fontWeight={600}>Vehicle:</Typography>
                              <Typography fontWeight={800}>{form.van}</Typography>
                           </Box>
                        </Stack>
                    </Box>
                    <Alert severity="warning" icon={<InfoIcon />}>A deposit may be required to confirm this booking. Our team will contact you shortly after submission.</Alert>
                  </Stack>
                )}
              </Box>

              {/* Navigation Footer */}
              <Box sx={{ p: 3, borderTop: `1px solid ${PALETTE.ui.border}`, bgcolor: "#fff", display: "flex", justifyContent: "space-between" }}>
                <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIosNewIcon />} sx={{ fontWeight: 700, textTransform: "none" }}>Back</Button>
                {activeStep === 3 ? (
                  <Button variant="contained" size="large" onClick={finalSubmit} sx={{ borderRadius: "12px", px: 6, py: 1.5, fontWeight: 800, bgcolor: PALETTE.status.success, "&:hover": { bgcolor: "#059669" } }}>Confirm & Book</Button>
                ) : (
                  <Button variant="contained" size="large" onClick={handleNext} endIcon={<ArrowForwardIosIcon />} sx={{ borderRadius: "12px", px: 6, py: 1.5, fontWeight: 800, bgcolor: PALETTE.primary.main }}>Next Step</Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* SIDEBAR SUMMARY */}
          {!isMobile && (
            <Box sx={{ width: 400, position: "sticky", top: 40 }}>
              <Card elevation={0} sx={{ borderRadius: "32px", border: `1px solid ${PALETTE.ui.border}`, p: 4, bgcolor: "#fff" }}>
                 <Stack spacing={3}>
                    <Typography variant="h6" fontWeight={900} color="primary">Trip Summary</Typography>
                    <Divider />
                    <Box>
                       <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1 }}>BOOKING STATUS</Typography>
                       <Typography variant="body1" fontWeight={700}>{form.bookingCategory || "Selection Pending..."}</Typography>
                    </Box>
                    <Box>
                       <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1 }}>DATES</Typography>
                       <Typography variant="body1" fontWeight={700}>{form.bookingDate} {form.returnDate && `- ${form.returnDate}`}</Typography>
                    </Box>
                    <Box>
                       <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 1 }}>VEHICLE</Typography>
                       <Typography variant="body1" fontWeight={700}>{form.van || "Choose a van"}</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: PALETTE.ui.bg, borderRadius: 4 }}>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: PALETTE.primary.main }}>{form.customerName ? form.customerName[0] : "?"}</Avatar>
                          <Box>
                             <Typography variant="subtitle2" fontWeight={800}>{form.customerName || "Guest User"}</Typography>
                             <Typography variant="caption" color="text.secondary">{form.mobileNumber || "No Contact"}</Typography>
                          </Box>
                       </Stack>
                    </Box>
                 </Stack>
              </Card>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default RequestForm;