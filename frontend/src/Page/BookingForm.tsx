/**
 * =================================================================================================
 * PROJECT: CLICKLANKA / VAN BOOKING SYSTEM
 * COMPONENT: RequestForm (Smart Availability - Hide Full, Show Partial)
 * AUTHOR: Gemini AI
 * DATE: 2026-01-07
 * =================================================================================================
 */

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo
} from "react";

// --- MATERIAL UI CORE ---
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Paper,
  InputAdornment,
  Stack,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Skeleton,
  Alert,
  Tooltip,
  Drawer,
  Chip,
  Avatar,
  LinearProgress,
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

// --- EXTERNAL LIBRARIES ---
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/* =================================================================================================
 * 1. CONFIGURATION & CONSTANTS
 * ================================================================================================= */

// API Configuration
const API_HOST = import.meta.env.VITE_API_HOST as string;

// Asset Constants
const ASSETS = {
  SEAT_MAP: "https://i.ibb.co/vCCVcpzc/Gemini-Generated-Image-o5mpvpo5mpvpo5mp.png",
};

// Design Constants
const FONTS = {
  PRIMARY: '"Montserrat", sans-serif',
  SECONDARY: '"Roboto", sans-serif',
};

// Validation Patterns
const REGEX = {
  MOBILE: /^(?:\+94|0)?7[0-9]{8}$/, // Sri Lankan Mobile Pattern
};

/* =================================================================================================
 * 2. DESIGN SYSTEM & THEME PALETTE
 * ================================================================================================= */

const PALETTE = {
  primary: {
    main: "#4f46e5", // Indigo 600
    dark: "#4338ca",  // Indigo 700
    light: "#e0e7ff", // Indigo 100
    contrast: "#ffffff",
  },
  secondary: {
    main: "#06b6d4", // Cyan 500
    dark: "#0891b2", // Cyan 600
    light: "#cffafe", // Cyan 100
    contrast: "#ffffff",
  },
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  ui: {
    bg: "#f8fafc",
    paper: "#ffffff",
    border: "#e2e8f0",
    inputBg: "#f1f5f9",
    textMain: "#0f172a",
    textMuted: "#64748b",
  },
  seat: {
    booked: "#ef4444",
    selected: "#4f46e5",
    available: "#ffffff",
    border: "#cbd5e1",
  },
};

// Reusable SxProps for Inputs
const INPUT_SX = {
  "& .MuiFilledInput-root": {
    backgroundColor: PALETTE.ui.inputBg,
    borderRadius: "16px",
    fontFamily: FONTS.PRIMARY,
    border: "2px solid transparent",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:before, &:after": { display: "none" },
    "&:hover": {
      backgroundColor: "#e2e8f0",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      borderColor: PALETTE.primary.main,
      boxShadow: `0 0 0 4px ${PALETTE.primary.light}`,
    },
    "&.Mui-error": {
      backgroundColor: "#fef2f2",
      borderColor: PALETTE.status.error,
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: FONTS.PRIMARY,
    color: PALETTE.ui.textMuted,
    fontWeight: 500,
    "&.Mui-focused": { color: PALETTE.primary.main },
    "&.Mui-error": { color: PALETTE.status.error },
  },
  "& .MuiInputBase-input": {
    fontFamily: FONTS.PRIMARY,
    fontWeight: 600,
    color: PALETTE.ui.textMain,
  },
};

/* =================================================================================================
 * 3. TYPESCRIPT INTERFACES
 * ================================================================================================= */

// --- Entity Types ---
interface Van {
  _id: string;
  vanname: string;
  Image: string[];
  seatType: "14" | "11";
  bookingStatus?: "AVAILABLE" | "PARTIAL" | "FULL"; // Critical for logic
  features?: string[];
}

interface SeatPosition {
  number: number;
  top: string;
  left: string;
}

// --- State Types ---
interface BookingFormState {
  customerName: string;
  mobileNumber: string;
  bookingDate: string;
  bookingCategory: string;
  country: string;
  arrivalTime: string;
  arrivalMode: string;
  van: string;
  seatNumber: string;
  ticketFile: File | null;
}

interface ValidationErrors {
  customerName?: string;
  mobileNumber?: string;
  bookingDate?: string;
  bookingCategory?: string;
  country?: string;
  arrivalTime?: string;
  arrivalMode?: string;
  van?: string;
  seatNumber?: string;
  ticketFile?: string;
}

/* =================================================================================================
 * 4. UTILITIES & HELPERS
 * ================================================================================================= */

/* =================================================================================================
 * 5. LAYOUT DATA DEFINITIONS
 * ================================================================================================= */

const BOOKING_CATEGORIES = [
  "Full Booking",
  "Seat Booking",
  "Booking from Abroad",
  "Emergency Booking",
  "Event Booking",
];

const WIZARD_STEPS = [
  "Trip Details",
  "Select Vehicle",
  "Select Seat",
  "Confirmation"
];

// Seat Coordinates (Optimized for CSS Absolute Positioning)
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

/* =================================================================================================
 * 6. REUSABLE UI COMPONENTS
 * ================================================================================================= */

// --- 6.1 Status Chip Component ---
const StatusChip: React.FC<{ status?: string }> = ({ status }) => {
  let label = "Available";
  let color = PALETTE.status.success;
  let icon = <CheckCircleIcon fontSize="small" />;

  // Note: 'FULL' should be hidden by parent, but handling just in case
  if (status === "FULL") {
    label = "Sold Out";
    color = PALETTE.status.error;
    icon = <ErrorIcon fontSize="small" />;
  } else if (status === "PARTIAL") {
    label = "Filling Fast";
    color = PALETTE.status.warning;
    icon = <AccessTimeIcon fontSize="small" />;
  }

  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        bgcolor: color,
        color: "#fff",
        fontWeight: 700,
        fontFamily: FONTS.PRIMARY,
        "& .MuiChip-icon": { color: "#fff" },
      }}
    />
  );
};

// --- 6.2 Van Card Component (LOGIC FOR PARTIAL BOOKINGS) ---
const VanCard: React.FC<{
  van: Van;
  isSelected: boolean;
  onSelect: (van: Van) => void;
  bookingCategory: string; // Needed for partial logic
}> = memo(({ van, isSelected, onSelect, bookingCategory }) => {
  
  // LOGIC:
  // 1. FULL vans are filtered out by parent component (not rendered).
  // 2. PARTIAL vans are rendered, but we disable them if User wants "Full Booking".
  
  let isDisabled = false;
  let overlayText = "";
  let overlayColor = "rgba(255, 255, 255, 0.9)";
  let textColor = PALETTE.status.warning;

  if (van.bookingStatus === "PARTIAL") {
    // If user wants Full Booking, block them because seats are taken
    if (bookingCategory === "Full Booking") {
      isDisabled = true;
      overlayText = "Reserved for Seat Booking";
    }
    // If user wants Seat Booking, keep enabled
  }

  return (
    <Card
      elevation={isSelected ? 8 : 0}
      sx={{
        borderRadius: "20px",
        position: "relative",
        border: isSelected
          ? `2px solid ${PALETTE.primary.main}`
          : `1px solid ${PALETTE.ui.border}`,
        bgcolor: isSelected ? PALETTE.primary.light : PALETTE.ui.paper,
        transition: "all 0.3s ease",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        "&:hover": {
          transform: !isDisabled ? "translateY(-5px)" : "none",
          boxShadow: !isDisabled ? "0 12px 24px rgba(0,0,0,0.1)" : "none",
          borderColor: !isDisabled ? PALETTE.primary.main : PALETTE.ui.border,
        },
      }}
    >
      <CardActionArea
        onClick={() => !isDisabled && onSelect(van)}
        disabled={isDisabled}
        sx={{ p: 2, height: "100%" }}
      >
        {/* Status Badge */}
        <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          <StatusChip status={van.bookingStatus} />
        </Box>

        {/* Selected Checkmark */}
        <Fade in={isSelected}>
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: PALETTE.primary.main,
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.4)",
            }}
          >
            <CheckCircleIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
        </Fade>

        {/* Van Image Container */}
        <Box
          sx={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            mt: 2,
            position: "relative",
          }}
        >
          {/* Overlay for Disabled State (Partial + Full Booking selected) */}
          {isDisabled && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: overlayColor,
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(2px)",
                p: 1,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: textColor,
                  fontWeight: 900,
                  border: `2px solid ${textColor}`,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  transform: "rotate(-5deg)",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  lineHeight: 1.4
                }}
              >
                {overlayText}
              </Typography>
            </Box>
          )}
          
          <CardMedia
            component="img"
            image={van.Image?.[0]}
            alt={van.vanname}
            sx={{
              height: "100%",
              objectFit: "contain",
              filter: isDisabled ? "grayscale(100%)" : "none",
              transition: "transform 0.5s ease",
              "&:hover": { transform: !isDisabled ? "scale(1.1)" : "none" },
            }}
          />
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 0, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY} gutterBottom>
            {van.vanname}
          </Typography>
          
          <Stack direction="row" spacing={1} justifyContent="center" mb={1}>
            <Chip icon={<EventSeatIcon />} label={`${van.seatType} Seats`} size="small" variant="outlined" />
            <Chip icon={<LocalGasStationIcon />} label="Diesel" size="small" variant="outlined" />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ color: PALETTE.ui.textMuted }}>
            <Tooltip title="Air Conditioned"><AcUnitIcon fontSize="small" /></Tooltip>
            <Tooltip title="Free WiFi"><WifiIcon fontSize="small" /></Tooltip>
            <Tooltip title="Spacious"><EventSeatIcon fontSize="small" /></Tooltip>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

// --- 6.3 Seat Map Component ---
const SeatMap: React.FC<{
  layout: SeatPosition[];
  bookedSeats: string[];
  selectedSeat: string;
  onSelect: (seat: SeatPosition) => void;
}> = ({ layout, bookedSeats, selectedSeat, onSelect }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        perspective: "1000px",
      }}
    >
      {/* Base Image */}
      <Box
        component="img"
        src={ASSETS.SEAT_MAP}
        alt="Van Layout"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: "20px",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
        }}
      />

      {/* Seat Overlay */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 10 }}>
        {layout.map((seat) => {
          const isBooked = bookedSeats.includes(seat.number.toString());
          const isSelected = selectedSeat === seat.number.toString();

          let bgColor = PALETTE.seat.available;
          let borderColor = PALETTE.seat.border;
          let textColor = PALETTE.ui.textMuted;
          let cursor = "pointer";
          let scale = 1;

          if (isBooked) {
            bgColor = PALETTE.seat.booked;
            borderColor = PALETTE.seat.booked;
            textColor = "#fff";
            cursor = "not-allowed";
          } else if (isSelected) {
            bgColor = PALETTE.seat.selected;
            borderColor = PALETTE.seat.selected;
            textColor = "#fff";
            scale = 1.15;
          }

          return (
            <Tooltip
              key={seat.number}
              title={isBooked ? "Booked" : `Select Seat ${seat.number}`}
              arrow
              placement="top"
            >
              <Box
                onClick={() => !isBooked && onSelect(seat)}
                sx={{
                  position: "absolute",
                  top: seat.top,
                  left: seat.left,
                  width: { xs: 26, sm: 32 },
                  height: { xs: 26, sm: 32 },
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: "8px",
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: cursor,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: FONTS.PRIMARY,
                  boxShadow: isSelected ? "0 4px 10px rgba(79, 70, 229, 0.4)" : "none",
                  transform: `rotate(-90deg) scale(${scale})`,
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    transform: !isBooked ? "rotate(-90deg) scale(1.2)" : "rotate(-90deg)",
                    borderColor: !isBooked ? PALETTE.primary.main : borderColor,
                    zIndex: 20,
                  },
                }}
              >
                {seat.number}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

// --- 6.4 Sidebar Summary Component ---
const OrderSummary: React.FC<{ form: BookingFormState; van: Van | undefined }> = ({ form, van }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "24px",
        bgcolor: PALETTE.ui.bg,
        border: `1px solid ${PALETTE.ui.border}`,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, bgcolor: "#fff", borderBottom: `1px solid ${PALETTE.ui.border}` }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: PALETTE.primary.light, color: PALETTE.primary.main }}>
            <ReceiptLongIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>
            Trip Details
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontFamily={FONTS.PRIMARY}>BOOKING TYPE</Typography>
            <Typography variant="body2" fontWeight={600} fontFamily={FONTS.PRIMARY}>{form.bookingCategory || "Not Selected"}</Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" fontFamily={FONTS.PRIMARY}>VEHICLE</Typography>
            <Typography variant="body2" fontWeight={600} fontFamily={FONTS.PRIMARY}>{van?.vanname || "Not Selected"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontFamily={FONTS.PRIMARY}>DATE</Typography>
            <Typography variant="body2" fontWeight={600} fontFamily={FONTS.PRIMARY}>{form.bookingDate || "Not Selected"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontFamily={FONTS.PRIMARY}>SELECTION</Typography>
            <Typography variant="body2" fontWeight={600} fontFamily={FONTS.PRIMARY}>
              {form.bookingCategory === "Full Booking" ? "Entire Vehicle" : (form.seatNumber ? `Seat #${form.seatNumber}` : "--")}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />

        <Box sx={{ p: 2, bgcolor: PALETTE.primary.light, borderRadius: "12px" }}>
           <Typography variant="caption" color="text.secondary" display="block">PASSENGER</Typography>
           <Typography variant="body2" fontWeight={700} color={PALETTE.primary.dark}>{form.customerName || "Guest"}</Typography>
           <Typography variant="caption" color={PALETTE.primary.main}>{form.mobileNumber}</Typography>
        </Box>

      </Box>

      <Box sx={{ p: 2, bgcolor: "#fff", display: "flex", alignItems: "center", gap: 1.5, borderTop: `1px solid ${PALETTE.ui.border}` }}>
        <VerifiedUserIcon sx={{ color: PALETTE.status.success, fontSize: 20 }} />
        <Typography variant="caption" fontWeight={600} fontFamily={FONTS.PRIMARY} color={PALETTE.ui.textMuted}>
          Booking confirmation will be sent via SMS.
        </Typography>
      </Box>
    </Card>
  );
};

/* =================================================================================================
 * 7. MAIN CONTROLLER COMPONENT
 * ================================================================================================= */

const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // --- No Persistence (Reset on Refresh) ---
  const [form, setForm] = useState<BookingFormState>({
    customerName: "", mobileNumber: "", bookingDate: "", bookingCategory: "",
    country: "", arrivalTime: "", arrivalMode: "", van: "", seatNumber: "",
    ticketFile: null,
  });

  // --- State ---
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loadingVans, setLoadingVans] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [vanList, setVanList] = useState<Van[]>([]);
  const [seatLayout, setSeatLayout] = useState<SeatPosition[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [openSpecialDialog, setOpenSpecialDialog] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const selectedVanObject = useMemo(() => vanList.find(v => v.vanname === form.van), [vanList, form.van]);

  // ===============================================================================================
  // API: FETCH VANS (WITH HIDING LOGIC)
  // ===============================================================================================
  const fetchVans = useCallback(async () => {
    try {
      setLoadingVans(true);
      const params = new URLSearchParams();
      if (form.bookingDate) params.append("date", form.bookingDate);
      
      const response = await fetch(`${API_HOST}/Vanaddinfo?${params}`);
      const data = await response.json();
      let vans = Array.isArray(data) ? data : [];

      // --- CRITICAL FILTER LOGIC ---
      if (form.bookingDate) {
        vans = vans.filter((van) => {
          // Rule 1: HIDE FULL VANS
          if (van.bookingStatus === "FULL") return false; 
          
          // Rule 2: Keep PARTIAL vans visible (handled in VanCard for disabling)
          // Rule 3: Keep AVAILABLE vans visible
          return true; 
        });
      }
      // -----------------------------

      setVanList(vans);

      // Handle case where selected van disappears from list (because it's now full)
      if (form.van) {
        const currentVan = vans.find(v => v.vanname === form.van);
        if (!currentVan && form.bookingDate) {
            setForm(prev => ({ ...prev, van: "", seatNumber: "" }));
        }
      }
    } catch (err) {
      console.error("API Error (Vans):", err);
    } finally {
      setLoadingVans(false);
    }
  }, [form.bookingDate, form.van]);

  useEffect(() => { fetchVans(); }, [fetchVans]);

  // --- Fetch Seats ---
  useEffect(() => {
    if (form.van && form.bookingDate) {
      setLoadingSeats(true);
      fetch(`${API_HOST}/booking/countSeats?vanname=${form.van}&date=${form.bookingDate}`)
        .then(res => res.json())
        .then(data => setBookedSeats(data.bookedSeats || []))
        .catch(err => console.error("API Error (Seats):", err))
        .finally(() => setLoadingSeats(false));
    } else {
      setBookedSeats([]);
    }
  }, [form.van, form.bookingDate]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "bookingCategory") {
        updated.van = ""; updated.seatNumber = ""; updated.ticketFile = null;
        if (value === "Emergency Booking" || value === "Event Booking") setOpenSpecialDialog(true);
      }
      return updated;
    });
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("File Too Large", "Please upload a file smaller than 5MB", "error");
        return;
      }
      setForm(prev => ({ ...prev, ticketFile: file }));
    }
  };

  const handleVanSelect = (van: Van) => {
    setForm(prev => ({ ...prev, van: van.vanname, seatNumber: "" }));
    setSeatLayout(van.seatType === "14" ? LAYOUTS.SEATS_14 : LAYOUTS.SEATS_11);
    handleNextStep();
  };

  const handleSeatSelect = (seat: SeatPosition) => {
    setForm(prev => ({ ...prev, seatNumber: seat.number.toString() }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!form.customerName) newErrors.customerName = "Full Name is required";
      if (!form.mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
      else if (!REGEX.MOBILE.test(form.mobileNumber)) newErrors.mobileNumber = "Invalid format";
      if (!form.bookingDate) newErrors.bookingDate = "Date is required";
      if (!form.bookingCategory) newErrors.bookingCategory = "Type is required";
      if (form.bookingCategory === "Booking from Abroad") {
        if (!form.country) newErrors.country = "Country is required";
        if (!form.arrivalTime) newErrors.arrivalTime = "Time is required";
      }
    } 
    else if (step === 1) {
      if (!["Emergency Booking", "Event Booking"].includes(form.bookingCategory) && !form.van) {
        newErrors.van = "Required";
        Swal.fire("Selection Required", "Please select a vehicle to continue.", "warning");
      }
    } 
    else if (step === 2) {
      const needsSeat = form.bookingCategory === "Seat Booking" || 
                        (form.bookingCategory === "Booking from Abroad" && form.arrivalMode === "seatSharing");
      if (needsSeat && !form.seatNumber) {
        newErrors.seatNumber = "Required";
        Swal.fire("Selection Required", "Please tap on a seat layout to select your seat.", "warning");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackStep = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value && key !== "ticketFile") formData.append(key, value as string);
    });
    if (form.ticketFile) formData.append("ticketFile", form.ticketFile);
    if (form.bookingCategory === "Full Booking" && form.van) {
      const allSeats = seatLayout.map(s => s.number.toString());
      formData.append("seatNumbers", JSON.stringify(allSeats));
    }

    try {
      const response = await fetch(`${API_HOST}/booking`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Server Error");

      await Swal.fire({
        title: "Booking Confirmed!",
        text: "Your booking has been successfully saved.",
        icon: "success",
        confirmButtonText: "Return Home",
        confirmButtonColor: PALETTE.primary.main,
      });

      setForm({
        customerName: "", mobileNumber: "", bookingDate: "", bookingCategory: "",
        country: "", arrivalTime: "", arrivalMode: "", van: "", seatNumber: "",
        ticketFile: null,
      });
      setActiveStep(0);
      setBookedSeats([]);

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Booking Failed",
        text: error.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: PALETTE.status.error
      });
    } finally {
      setSubmitting(false);
    }
  };

  const showAbroadFields = form.bookingCategory === "Booking from Abroad";
  const showVansStep = form.bookingCategory && !["Emergency Booking", "Event Booking"].includes(form.bookingCategory);
  const showSeatStep = (form.bookingCategory === "Seat Booking" || (form.bookingCategory === "Booking from Abroad" && form.arrivalMode === "seatSharing")) && form.van;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: PALETTE.ui.bg, fontFamily: FONTS.PRIMARY }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        
        {/* --- Header --- */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.2, bgcolor: PALETTE.primary.main, borderRadius: "14px", boxShadow: `0 8px 20px ${PALETTE.primary.light}` }}>
              <DirectionsBusIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} fontFamily={FONTS.PRIMARY} color={PALETTE.ui.textMain}>
                VanBooker<span style={{ color: PALETTE.primary.main }}>.</span>
              </Typography>
              <Typography variant="caption" fontFamily={FONTS.PRIMARY} color={PALETTE.ui.textMuted} fontWeight={500}>
                Premium Travel Solutions
              </Typography>
            </Box>
          </Stack>

          {isMobile && activeStep > 0 && (
            <Button
              variant="outlined"
              startIcon={<ReceiptLongIcon />}
              onClick={() => setOpenDrawer(true)}
              sx={{ borderRadius: "20px", fontFamily: FONTS.PRIMARY, textTransform: "none", fontWeight: 600 }}
            >
              Details
            </Button>
          )}
        </Box>

        {/* --- Main Layout --- */}
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          
          {/* Left Column */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                overflow: "hidden",
                border: `1px solid ${PALETTE.ui.border}`,
                backgroundColor: PALETTE.ui.paper,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)",
              }}
            >
              {/* Stepper */}
              <Box sx={{ p: 3, bgcolor: "#fff", borderBottom: `1px solid ${PALETTE.ui.border}` }}>
                <Stepper activeStep={activeStep} alternativeLabel={isMobile}>
                  {WIZARD_STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconProps={{
                        sx: { "&.Mui-active": { color: PALETTE.primary.main }, "&.Mui-completed": { color: PALETTE.status.success } }
                      }}>
                        <Typography variant="caption" fontWeight={700} fontFamily={FONTS.PRIMARY}>{label}</Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <LinearProgress 
                  variant="determinate" 
                  value={(activeStep / (WIZARD_STEPS.length - 1)) * 100} 
                  sx={{ mt: 2, borderRadius: 1, height: 6, bgcolor: PALETTE.ui.inputBg, "& .MuiLinearProgress-bar": { bgcolor: PALETTE.primary.main } }} 
                />
              </Box>

              {/* Dynamic Content */}
              <Box sx={{ p: { xs: 3, md: 5 }, minHeight: "550px" }}>
                <Fade in={true} key={activeStep} timeout={600}>
                  <Box>
                    {/* STEP 0 */}
                    {activeStep === 0 && (
                      <Stack spacing={4}>
                        <Box>
                          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY} gutterBottom>
                            Who is traveling?
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontFamily={FONTS.PRIMARY} mb={3}>
                            We need your details to send you the booking confirmation.
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                              <TextField
                                label="Full Name"
                                name="customerName"
                                value={form.customerName}
                                onChange={handleInputChange}
                                fullWidth
                                variant="filled"
                                sx={INPUT_SX}
                                error={!!errors.customerName}
                                helperText={errors.customerName}
                                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <TextField
                                label="Mobile Number"
                                name="mobileNumber"
                                value={form.mobileNumber}
                                onChange={handleInputChange}
                                fullWidth
                                variant="filled"
                                sx={INPUT_SX}
                                error={!!errors.mobileNumber}
                                helperText={errors.mobileNumber}
                                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment> }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Box>
                          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY} gutterBottom>
                            Journey Details
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                              <TextField
                                type="date"
                                label="Travel Date"
                                name="bookingDate"
                                value={form.bookingDate}
                                onChange={handleInputChange}
                                fullWidth
                                variant="filled"
                                sx={INPUT_SX}
                                error={!!errors.bookingDate}
                                helperText={errors.bookingDate}
                                InputLabelProps={{ shrink: true, sx: { fontFamily: FONTS.PRIMARY } }}
                                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon color="action" /></InputAdornment> }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Fade in={!!form.bookingDate}>
                                <TextField
                                  select
                                  label="Booking Category"
                                  name="bookingCategory"
                                  value={form.bookingCategory}
                                  onChange={handleInputChange}
                                  fullWidth
                                  variant="filled"
                                  sx={INPUT_SX}
                                  error={!!errors.bookingCategory}
                                  helperText={errors.bookingCategory}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsBusIcon color="action" /></InputAdornment> }}
                                >
                                  {BOOKING_CATEGORIES.map((cat) => (
                                    <MenuItem key={cat} value={cat} sx={{ fontFamily: FONTS.PRIMARY, py: 1.5 }}>
                                      {cat}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Fade>
                            </Box>
                          </Box>
                        </Box>

                        {/* Abroad Section */}
                        {showAbroadFields && (
                          <Slide direction="up" in={showAbroadFields} mountOnEnter unmountOnExit>
                            <Box sx={{ p: 3, borderRadius: "20px", bgcolor: "#f0f9ff", border: `1px solid ${PALETTE.secondary.light}` }}>
                              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <AirplaneTicketIcon sx={{ color: PALETTE.secondary.dark }} />
                                <Typography fontWeight={700} fontFamily={FONTS.PRIMARY} color={PALETTE.secondary.dark}>
                                  Flight Information
                                </Typography>
                              </Stack>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                  <TextField label="Origin Country" name="country" value={form.country} onChange={handleInputChange} fullWidth variant="filled" sx={INPUT_SX} error={!!errors.country} helperText={errors.country} InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon color="action" /></InputAdornment> }} />
                                  <TextField type="time" label="Arrival Time" name="arrivalTime" value={form.arrivalTime} onChange={handleInputChange} fullWidth variant="filled" sx={INPUT_SX} error={!!errors.arrivalTime} helperText={errors.arrivalTime} InputLabelProps={{ shrink: true, sx: { fontFamily: FONTS.PRIMARY } }} InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon color="action" /></InputAdornment> }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                  <TextField select label="Arrival Mode" name="arrivalMode" value={form.arrivalMode} onChange={handleInputChange} fullWidth variant="filled" sx={INPUT_SX}>
                                    <MenuItem value="fullVan" sx={{ fontFamily: FONTS.PRIMARY }}>Full Van</MenuItem>
                                    <MenuItem value="seatSharing" sx={{ fontFamily: FONTS.PRIMARY }}>Seat Sharing</MenuItem>
                                  </TextField>
                                  <Button component="label" variant="outlined" fullWidth sx={{ height: "56px", borderStyle: "dashed", fontFamily: FONTS.PRIMARY, color: form.ticketFile ? PALETTE.status.success : PALETTE.ui.textMuted, borderColor: form.ticketFile ? PALETTE.status.success : PALETTE.ui.border }}>
                                    {form.ticketFile ? "File Attached!" : "Upload Ticket PDF/IMG"}
                                    <input hidden type="file" accept=".pdf,image/*" onChange={handleFileChange} />
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Slide>
                        )}
                      </Stack>
                    )}

                    {/* STEP 1 */}
                    {activeStep === 1 && showVansStep && (
                      <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY}>
                            Available Vehicles
                          </Typography>
                          <IconButton onClick={fetchVans} title="Refresh" size="small"><RestartAltIcon /></IconButton>
                        </Stack>

                        {loadingVans ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {[1, 2, 3].map(i => (
                              <Skeleton key={i} variant="rectangular" height={220} sx={{ borderRadius: "20px", width: { xs: '100%', sm: '48%', md: '31%' } }} />
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {vanList.length > 0 ? (
                              vanList.map((van) => (
                                <Box key={van._id} sx={{ width: { xs: '100%', sm: '48%', md: '31%' }, flexGrow: 1 }}>
                                  <VanCard
                                    van={van}
                                    isSelected={form.van === van.vanname}
                                    onSelect={handleVanSelect}
                                    bookingCategory={form.bookingCategory}
                                  />
                                </Box>
                              ))
                            ) : (
                              <Box sx={{ width: "100%", textAlign: "center", py: 6, bgcolor: "#fff1f2", borderRadius: "20px", border: `1px dashed ${PALETTE.status.error}` }}>
                                <ErrorIcon sx={{ fontSize: 48, color: PALETTE.status.error, mb: 1 }} />
                                <Typography variant="h6" fontFamily={FONTS.PRIMARY} fontWeight={700}>No Vehicles Available</Typography>
                                <Typography variant="body2">
                                  {form.bookingDate 
                                    ? "All vans are fully booked or reserved on this date." 
                                    : "Please select a valid date first."}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Stack>
                    )}

                    {/* STEP 2 */}
                    {activeStep === 2 && showSeatStep && (
                      <Stack spacing={4} alignItems="center">
                        <Box textAlign="center">
                          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY} gutterBottom>
                            Select Your Seat
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click on an available seat to proceed.
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={3} sx={{ bgcolor: "#fff", p: 1.5, borderRadius: "50px", border: `1px solid ${PALETTE.ui.border}` }}>
                          {[{ l: "Available", c: PALETTE.seat.available, b: PALETTE.seat.border }, { l: "Selected", c: PALETTE.seat.selected, b: PALETTE.seat.selected }, { l: "Booked", c: PALETTE.seat.booked, b: PALETTE.seat.booked }].map(item => (
                            <Stack key={item.l} direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ width: 14, height: 14, bgcolor: item.c, border: `1px solid ${item.b}`, borderRadius: "4px" }} />
                              <Typography variant="caption" fontWeight={600} fontFamily={FONTS.PRIMARY}>{item.l}</Typography>
                            </Stack>
                          ))}
                        </Stack>

                        <Box sx={{ position: "relative", mt: 2, p: 2 }}>
                          {loadingSeats ? <CircularProgress /> : (
                            <SeatMap
                              layout={seatLayout}
                              bookedSeats={bookedSeats}
                              selectedSeat={form.seatNumber}
                              onSelect={handleSeatSelect}
                            />
                          )}
                        </Box>

                        {form.bookingCategory === "Full Booking" && (
                          <Alert severity="info" sx={{ borderRadius: "12px", fontFamily: FONTS.PRIMARY, maxWidth: "500px" }}>
                            You have selected <b>Full Booking</b>. Although you select one seat visually, the <b>entire van</b> will be reserved for you.
                          </Alert>
                        )}
                      </Stack>
                    )}

                    {/* STEP 3 */}
                    {activeStep === 3 && (
                      <Stack spacing={4}>
                        <Alert icon={<VerifiedUserIcon fontSize="inherit" />} severity="success" sx={{ borderRadius: "16px", fontFamily: FONTS.PRIMARY }}>
                          Please review your details. This is the final step!
                        </Alert>

                        <Box sx={{ p: 3, borderRadius: "20px", bgcolor: PALETTE.ui.inputBg, border: `1px solid ${PALETTE.ui.border}` }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                              <Typography variant="subtitle2" color="text.secondary" fontFamily={FONTS.PRIMARY}>Customer Name</Typography>
                              <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>{form.customerName}</Typography>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                              <Typography variant="subtitle2" color="text.secondary" fontFamily={FONTS.PRIMARY}>Contact Number</Typography>
                              <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>{form.mobileNumber}</Typography>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                              <Typography variant="subtitle2" color="text.secondary" fontFamily={FONTS.PRIMARY}>Travel Date</Typography>
                              <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>{form.bookingDate}</Typography>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                              <Typography variant="subtitle2" color="text.secondary" fontFamily={FONTS.PRIMARY}>Vehicle & Seat</Typography>
                              <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>
                                {form.van} — {form.bookingCategory === "Full Booking" ? "Full Van" : `Seat ${form.seatNumber}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f0f9ff", p: 2, borderRadius: "12px" }}>
                          <input type="checkbox" id="terms" style={{ width: "18px", height: "18px", accentColor: PALETTE.primary.main }} />
                          <Typography component="label" htmlFor="terms" variant="body2" sx={{ ml: 1.5, fontFamily: FONTS.PRIMARY }}>
                            I agree to the <span style={{ fontWeight: 700, color: PALETTE.primary.main, cursor: "pointer", textDecoration: "underline" }} onClick={() => setOpenTermsDialog(true)}>Terms & Conditions</span> and Privacy Policy.
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                </Fade>
              </Box>

              {/* Footer */}
              <Box sx={{ p: 3, borderTop: `1px solid ${PALETTE.ui.border}`, display: "flex", justifyContent: "space-between", bgcolor: "#fff" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBackStep}
                  startIcon={<ArrowBackIosNewIcon />}
                  sx={{ color: PALETTE.ui.textMuted, fontFamily: FONTS.PRIMARY, textTransform: "none", fontWeight: 600 }}
                >
                  Back
                </Button>

                {activeStep === WIZARD_STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{
                      bgcolor: PALETTE.status.success,
                      px: 6,
                      py: 1.5,
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
                      "&:hover": { bgcolor: "#059669" },
                    }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : "Confirm Booking"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNextStep}
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{
                      bgcolor: PALETTE.primary.main,
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 8px 16px rgba(79, 70, 229, 0.3)",
                      "&:hover": { bgcolor: PALETTE.primary.dark },
                    }}
                  >
                    Next Step
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Right Column */}
          <Box sx={{ width: { xs: "100%", lg: "380px" }, display: { xs: "none", lg: "block" } }}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <OrderSummary form={form} van={selectedVanObject} />
            </Box>
          </Box>

        </Stack>
      </Container>

      {/* Drawers and Dialogs */}
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { borderRadius: "24px 24px 0 0", p: 3, maxHeight: "80vh" } }}
      >
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700} fontFamily={FONTS.PRIMARY}>Trip Summary</Typography>
          <IconButton onClick={() => setOpenDrawer(false)}><CloseIcon /></IconButton>
        </Stack>
        <OrderSummary form={form} van={selectedVanObject} />
      </Drawer>

      <Dialog
        open={openSpecialDialog}
        onClose={() => setOpenSpecialDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 2, textAlign: "center" } }}
      >
        <DialogContent>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: PALETTE.primary.light, color: PALETTE.primary.main, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <LocalOfferIcon fontSize="large" />
          </Box>
          <Typography variant="h6" fontWeight={800} fontFamily={FONTS.PRIMARY} gutterBottom>Special Booking</Typography>
          <Typography variant="body2" color="text.secondary" fontFamily={FONTS.PRIMARY} mb={3}>
            Events and Emergencies require a custom quote handled by our specialized team.
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" fullWidth onClick={() => navigate("/specialRequestForm")} sx={{ bgcolor: PALETTE.primary.main, borderRadius: "12px", py: 1.5, fontFamily: FONTS.PRIMARY, textTransform: "none", fontWeight: 700 }}>
              Go to Special Form
            </Button>
            <Button variant="text" onClick={() => { setOpenSpecialDialog(false); setForm(p => ({...p, bookingCategory: ""})) }} sx={{ color: PALETTE.ui.textMuted, fontFamily: FONTS.PRIMARY, textTransform: "none" }}>
              Cancel Selection
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={openTermsDialog} onClose={() => setOpenTermsDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700 }}>Terms & Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" fontFamily={FONTS.PRIMARY} paragraph>1. Bookings must be made at least 24 hours in advance.</Typography>
          <Typography variant="body2" fontFamily={FONTS.PRIMARY} paragraph>2. Full payment or a deposit is required upon confirmation.</Typography>
          <Typography variant="body2" fontFamily={FONTS.PRIMARY} paragraph>3. Cancellations made within 24 hours of the trip are non-refundable.</Typography>
          <Typography variant="body2" fontFamily={FONTS.PRIMARY} paragraph>4. The company reserves the right to change the vehicle allocation due to unforeseen circumstances.</Typography>
          <Typography variant="body2" fontFamily={FONTS.PRIMARY}>5. Passenger conduct guidelines apply during travel.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTermsDialog(false)} sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600 }}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default RequestForm;