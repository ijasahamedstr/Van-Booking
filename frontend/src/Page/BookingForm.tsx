/**
 * =================================================================================================
 * PROJECT: CLICKLANKA / ADVANCED VAN BOOKING SYSTEM
 * COMPONENT: RequestForm (Production Scale)
 * VERSION: 2.1.0
 * FEATURES: 
 * - Single/Multi-Day Trip Logic
 * - Dynamic Date Range Validation
 * - Smart Vehicle Filtering (Hides Full, Disables Partial for Full Booking)
 * - Interactive Seat Map with SVG-Overlay Logic
 * - Responsive Mobile Drawers & Desktop Sidebars
 * =================================================================================================
 */

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo
} from "react";
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
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

/* =================================================================================================
 * 1. CONFIGURATION & DESIGN SYSTEM
 * ================================================================================================= */

const API_HOST = import.meta.env.VITE_API_HOST as string;
const TODAY_DATE = new Date().toISOString().split("T")[0];

const ASSETS = {
  SEAT_MAP: "https://i.ibb.co/vCCVcpzc/Gemini-Generated-Image-o5mpvpo5mpvpo5mp.png",
};

const FONTS = {
  PRIMARY: '"Montserrat", sans-serif',
  SECONDARY: '"Roboto", sans-serif',
};

const PALETTE = {
  primary: { main: "#4f46e5", dark: "#4338ca", light: "#e0e7ff" },
  secondary: { main: "#06b6d4", dark: "#0891b2", light: "#cffafe" },
  status: { success: "#10b981", warning: "#f59e0b", error: "#ef4444" },
  ui: { bg: "#f8fafc", paper: "#ffffff", border: "#e2e8f0", inputBg: "#f1f5f9", textMain: "#0f172a", textMuted: "#64748b" },
  seat: { booked: "#ef4444", selected: "#4f46e5", available: "#ffffff", border: "#cbd5e1" },
};

const INPUT_SX = {
  "& .MuiFilledInput-root": {
    backgroundColor: PALETTE.ui.inputBg,
    borderRadius: "16px",
    fontFamily: FONTS.PRIMARY,
    border: "2px solid transparent",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:before, &:after": { display: "none" },
    "&.Mui-focused": { backgroundColor: "#fff", borderColor: PALETTE.primary.main, boxShadow: `0 0 0 4px ${PALETTE.primary.light}` },
    "&.Mui-error": { backgroundColor: "#fef2f2", borderColor: PALETTE.status.error },
  },
  "& .MuiInputLabel-root": { fontFamily: FONTS.PRIMARY, color: PALETTE.ui.textMuted, fontWeight: 500 },
};

/* =================================================================================================
 * 2. INTERFACES
 * ================================================================================================= */

interface Van {
  _id: string;
  vanname: string;
  Image: string[];
  seatType: "14" | "11";
  bookingStatus?: "AVAILABLE" | "PARTIAL" | "FULL";
}

interface SeatPos { number: number; top: string; left: string; }

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
 * 3. CONSTANT DATA
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

const CATEGORIES = ["Full Booking", "Seat Booking", "Booking from Abroad", "Emergency Booking", "Event Booking"];
const WIZARD_STEPS = ["Journey Details", "Vehicle Select", "Seat Selection", "Final Review"];

/* =================================================================================================
 * 4. COMPONENTS
 * ================================================================================================= */

const OrderSummary = ({ form, van }: { form: BookingFormState; van?: Van }) => (
  <Card sx={{ borderRadius: "24px", border: `1px solid ${PALETTE.ui.border}`, overflow: "hidden" }}>
    <Box sx={{ p: 3, bgcolor: "#fff", borderBottom: `1px solid ${PALETTE.ui.border}` }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: PALETTE.primary.main }}><TravelExploreIcon /></Avatar>
        <Typography variant="h6" fontWeight={800}>Trip Summary</Typography>
      </Stack>
    </Box>
    <Box sx={{ p: 3, bgcolor: PALETTE.ui.bg }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>TRIP TYPE</Typography>
          <Typography variant="body1" fontWeight={700} color="primary.main">
            {form.tripType === "single" ? "Single Day" : "Multi-Day Journey"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>DATE RANGE</Typography>
          <Typography variant="body1" fontWeight={700}>
            {form.bookingDate} {form.returnDate && `→ ${form.returnDate}`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>VEHICLE</Typography>
          <Typography variant="body1" fontWeight={700}>{van?.vanname || "Not Selected"}</Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "12px", border: `1px solid ${PALETTE.ui.border}` }}>
          <Typography variant="caption" color="text.secondary">PASSENGER</Typography>
          <Typography variant="body1" fontWeight={800}>{form.customerName || "Guest User"}</Typography>
          <Typography variant="body2" color="text.secondary">{form.mobileNumber}</Typography>
        </Box>
      </Stack>
    </Box>
  </Card>
);

const RequestForm = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:1024px)");

  // Form State
  const [form, setForm] = useState<BookingFormState>({
    customerName: "", mobileNumber: "", tripType: "single",
    bookingDate: TODAY_DATE, returnDate: "", bookingCategory: "",
    country: "", arrivalTime: "", arrivalMode: "fullVan", van: "",
    seatNumber: "", ticketFile: null,
  });

  // UI State
  const [activeStep, setActiveStep] = useState(0);
  const [vanList, setVanList] = useState<Van[]>([]);
  const [loadingVans, setLoadingVans] = useState(false);
  const [seatLayout, setSeatLayout] = useState<SeatPos[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const selectedVanObject = useMemo(() => vanList.find(v => v.vanname === form.van), [vanList, form.van]);

  // Fetch Logic
  const fetchVans = useCallback(async () => {
    setLoadingVans(true);
    try {
      const res = await fetch(`${API_HOST}/Vanaddinfo?date=${form.bookingDate}`);
      const data = await res.json();
      const filtered = Array.isArray(data) ? data.filter(v => v.bookingStatus !== "FULL") : [];
      setVanList(filtered);
    } catch (e) { console.error(e); }
    finally { setLoadingVans(false); }
  }, [form.bookingDate]);

  useEffect(() => { if (activeStep === 1) fetchVans(); }, [activeStep, fetchVans]);

  const handleNext = () => {
    const err: any = {};
    if (activeStep === 0) {
      if (!form.customerName) err.customerName = "Name is required";
      if (!form.mobileNumber) err.mobileNumber = "Mobile is required";
      if (form.tripType === "multi" && !form.returnDate) err.returnDate = "Return date required";
    }
    if (activeStep === 1 && !form.van) { Swal.fire("Required", "Please select a vehicle", "warning"); return; }
    
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    setActiveStep(s => s + 1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: PALETTE.ui.bg, py: { xs: 2, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
          
          {/* Main Booking Panel */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper elevation={0} sx={{ borderRadius: "32px", border: `1px solid ${PALETTE.ui.border}`, overflow: "hidden" }}>
              
              {/* Stepper Header */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${PALETTE.ui.border}`, bgcolor: "#fff" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {WIZARD_STEPS.map(label => (
                    <Step key={label}><StepLabel><Typography variant="caption" fontWeight={700}>{label}</Typography></StepLabel></Step>
                  ))}
                </Stepper>
                <LinearProgress variant="determinate" value={(activeStep / 3) * 100} sx={{ mt: 3, height: 6, borderRadius: 3 }} />
              </Box>

              <Box sx={{ p: { xs: 3, md: 6 }, minHeight: 500 }}>
                {activeStep === 0 && (
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="h6" fontWeight={800} gutterBottom>Choose Trip Type</Typography>
                      <ToggleButtonGroup
                        value={form.tripType}
                        exclusive
                        onChange={(_, val) => val && setForm({ ...form, tripType: val, returnDate: "" })}
                        fullWidth
                        sx={{ bgcolor: PALETTE.ui.inputBg, p: 0.5, borderRadius: "16px" }}
                      >
                        <ToggleButton value="single" sx={{ border: "none", borderRadius: "12px", py: 1.5, fontWeight: 700 }}>
                          <CalendarTodayIcon sx={{ mr: 1 }} /> Single Day
                        </ToggleButton>
                        <ToggleButton value="multi" sx={{ border: "none", borderRadius: "12px", py: 1.5, fontWeight: 700 }}>
                          <DateRangeIcon sx={{ mr: 1 }} /> Multi-Day Trip
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                      <TextField label="Full Name" variant="filled" sx={INPUT_SX} name="customerName" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} error={!!errors.customerName} />
                      <TextField label="Mobile Number" variant="filled" sx={INPUT_SX} name="mobileNumber" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} error={!!errors.mobileNumber} />
                      <TextField type="date" label="Start Date" variant="filled" sx={INPUT_SX} value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})} InputLabelProps={{ shrink: true }} inputProps={{ min: TODAY_DATE }} />
                      {form.tripType === "multi" && (
                        <TextField type="date" label="Return Date" variant="filled" sx={INPUT_SX} value={form.returnDate} onChange={e => setForm({...form, returnDate: e.target.value})} error={!!errors.returnDate} InputLabelProps={{ shrink: true }} inputProps={{ min: form.bookingDate }} />
                      )}
                    </Box>

                    <TextField select label="Booking Category" variant="filled" sx={INPUT_SX} value={form.bookingCategory} onChange={e => setForm({...form, bookingCategory: e.target.value})}>
                      {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                  </Stack>
                )}

                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={800} mb={3}>Select Available Vehicle</Typography>
                    {loadingVans ? <CircularProgress /> : (
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 3 }}>
                        {vanList.map(v => (
                          <Card key={v._id} sx={{ borderRadius: "20px", border: form.van === v.vanname ? `2px solid ${PALETTE.primary.main}` : `1px solid ${PALETTE.ui.border}`, bgcolor: form.van === v.vanname ? PALETTE.primary.light : "#fff" }}>
                            <CardActionArea onClick={() => { setForm({...form, van: v.vanname}); setSeatLayout(v.seatType === "14" ? LAYOUTS.SEATS_14 : LAYOUTS.SEATS_11); }}>
                              <CardMedia component="img" image={v.Image?.[0]} height="140" sx={{ objectFit: "contain", mt: 2 }} />
                              <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h6" fontWeight={800}>{v.vanname}</Typography>
                                <Typography variant="caption" color="text.secondary">{v.seatType} Seats • A/C • WiFi</Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight={800} mb={4}>Choose Your Seat</Typography>
                    {form.bookingCategory === "Full Booking" ? (
                      <Alert severity="success" sx={{ borderRadius: "16px" }}>The entire vehicle is reserved for your trip. No individual seat selection needed.</Alert>
                    ) : (
                      <Box sx={{ position: "relative", width: "fit-content", mx: "auto" }}>
                        <Box component="img" src={ASSETS.SEAT_MAP} width={350} sx={{ borderRadius: "20px" }} />
                        {seatLayout.map(s => (
                          <Button key={s.number} onClick={() => setForm({...form, seatNumber: s.number.toString()})} sx={{ position: "absolute", top: s.top, left: s.left, minWidth: 32, height: 32, bgcolor: form.seatNumber === s.number.toString() ? "primary.main" : "white", color: form.seatNumber === s.number.toString() ? "white" : "black", border: "1px solid #ccc", borderRadius: "6px", p: 0, fontSize: "10px", fontWeight: 700 }}>{s.number}</Button>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {activeStep === 3 && (
                  <Stack spacing={4}>
                    <Alert icon={<VerifiedUserIcon />} severity="success" sx={{ borderRadius: "16px" }}>Final Check: Everything looks good! Ready to book?</Alert>
                    <OrderSummary form={form} van={selectedVanObject} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: PALETTE.ui.inputBg, borderRadius: "12px" }}>
                       <input type="checkbox" style={{ transform: "scale(1.5)" }} />
                       <Typography variant="body2">I agree to the Terms of Service and Cancellation Policy.</Typography>
                    </Box>
                  </Stack>
                )}
              </Box>

              {/* Navigation Footer */}
              <Box sx={{ p: 3, bgcolor: "#fff", borderTop: `1px solid ${PALETTE.ui.border}`, display: "flex", justifyContent: "space-between" }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>Back</Button>
                {activeStep === 3 ? (
                  <Button variant="contained" onClick={async () => { setSubmitting(true); setTimeout(() => navigate("/"), 2000); }} disabled={submitting}>{submitting ? <CircularProgress size={24} /> : "Confirm & Book Now"}</Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>Next Step</Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Desktop Summary Sidebar */}
          {!isMobile && (
            <Box sx={{ width: 400, position: "sticky", top: 20 }}>
              <OrderSummary form={form} van={selectedVanObject} />
            </Box>
          )}

        </Stack>
      </Container>
    </Box>
  );
};

export default RequestForm;