/**
 * PROJECT: CLICKLANKA / ADVANCED VAN BOOKING SYSTEM
 * VERSION: 3.1.0 (No Grid Layout - Vertical List & Stack Only)
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Box, TextField, MenuItem, Button, Typography, Container, Card, CardActionArea,
  Paper, Stack, Fade, useMediaQuery,
  CircularProgress, Divider, Stepper, Step, StepLabel, Alert, 
  Avatar, ToggleButtonGroup, ToggleButton, LinearProgress
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const API_HOST = import.meta.env.VITE_API_HOST as string;
const TODAY_DATE = new Date().toISOString().split("T")[0];

const PALETTE = {
  primary: { main: "#4f46e5", dark: "#4338ca", light: "#e0e7ff" },
  status: { success: "#10b981", error: "#ef4444" },
  ui: { bg: "#f8fafc", paper: "#ffffff", border: "#e2e8f0", inputBg: "#f1f5f9" },
};

/* =================================================================================================
 * SUB-COMPONENTS
 * ================================================================================================= */

const OrderSummary = ({ form, van }: { form: any; van?: any }) => (
  <Card sx={{ borderRadius: "24px", border: `1px solid ${PALETTE.ui.border}`, overflow: "hidden" }}>
    <Box sx={{ p: 3, bgcolor: "#fff", borderBottom: `1px solid ${PALETTE.ui.border}` }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: PALETTE.primary.main }}><TravelExploreIcon /></Avatar>
        <Typography variant="h6" fontWeight={800}>Trip Summary</Typography>
      </Stack>
    </Box>
    <Box sx={{ p: 3, bgcolor: PALETTE.ui.bg }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>TRIP TYPE</Typography>
          <Typography variant="body2" fontWeight={700} sx={{ textTransform: "uppercase" }}>
            {form.tripType === 'multi' ? 'Multi-Day Round Trip' : 'Single Day Trip'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>VEHICLE & SEAT</Typography>
          <Typography variant="body1" fontWeight={700}>
            {van?.vanname || "Not Selected"} — {form.bookingCategory === "Full Booking" ? "Full Van" : (form.seatNumber ? `Seat #${form.seatNumber}` : "Pending")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>TRAVEL DATES</Typography>
          <Typography variant="body1" fontWeight={700}>
            {form.bookingDate} {form.tripType === "multi" && form.returnDate ? ` → ${form.returnDate}` : ""}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: "12px" }}>
          <Typography variant="caption" color="text.secondary">PASSENGER</Typography>
          <Typography variant="body1" fontWeight={800}>{form.customerName || "Guest"}</Typography>
          <Typography variant="body2" color="text.secondary">{form.mobileNumber || "No Number"}</Typography>
        </Box>
      </Stack>
    </Box>
  </Card>
);

/* =================================================================================================
 * MAIN COMPONENT
 * ================================================================================================= */

const RequestForm = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:1024px)");

  const [activeStep, setActiveStep] = useState(0);
  const [vanList, setVanList] = useState<any[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    tripType: "single",
    bookingDate: TODAY_DATE,
    returnDate: "",
    bookingCategory: "Seat Booking",
    vanId: "", 
    vanName: "",
    seatNumber: "",
  });

  const fetchVans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_HOST}/Vanaddinfo?date=${form.bookingDate}`);
      const data = await res.json();
      setVanList(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [form.bookingDate]);

  const fetchTakenSeats = useCallback(async () => {
    if (!form.vanId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_HOST}/booking/check-seats?vanId=${form.vanId}&date=${form.bookingDate}`);
      const data = await res.json();
      setBookedSeats(data.takenSeats || []); 
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [form.vanId, form.bookingDate]);

  useEffect(() => {
    if (activeStep === 1) fetchVans();
    if (activeStep === 2 && form.bookingCategory === "Seat Booking") fetchTakenSeats();
  }, [activeStep, fetchVans, fetchTakenSeats]);

  const selectedVan = useMemo(() => vanList.find(v => v._id === form.vanId), [vanList, form.vanId]);

  const handleNext = () => {
    if (activeStep === 0) {
        if (!form.customerName || !form.mobileNumber) return Swal.fire("Required", "Details missing", "warning");
        if (form.tripType === "multi" && !form.returnDate) return Swal.fire("Required", "Select return date", "warning");
    }
    if (activeStep === 1 && !form.vanId) return Swal.fire("Required", "Select a van", "warning");
    if (activeStep === 2 && form.bookingCategory === "Seat Booking" && !form.seatNumber) return Swal.fire("Required", "Select a seat", "warning");
    setActiveStep(prev => prev + 1);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_HOST}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...form,
            seatNumber: form.bookingCategory === "Full Booking" ? "FULL" : form.seatNumber,
            returnDate: form.tripType === "single" ? form.bookingDate : form.returnDate 
        }),
      });
      if (res.ok) {
        Swal.fire("Success", "Booking Confirmed!", "success");
        navigate("/");
      }
    } catch (e) { Swal.fire("Error", "Booking failed", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: PALETTE.ui.bg, py: { xs: 2, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
          
          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper elevation={0} sx={{ borderRadius: "32px", border: `1px solid ${PALETTE.ui.border}`, overflow: "hidden" }}>
              
              <Box sx={{ p: 3, borderBottom: `1px solid ${PALETTE.ui.border}`, bgcolor: "#fff" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {["Schedule", "Vehicle", "Seats", "Review"].map(label => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                  ))}
                </Stepper>
              </Box>

              <Box sx={{ p: { xs: 3, md: 6 }, minHeight: 450 }}>
                
                {/* STEP 0: DETAILS (Vertical Stack) */}
                {activeStep === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" fontWeight={800}>Travel Details</Typography>
                    
                    <ToggleButtonGroup
                        value={form.tripType}
                        exclusive
                        onChange={(_, v) => v && setForm({...form, tripType: v, returnDate: ""})}
                        sx={{ bgcolor: PALETTE.ui.inputBg, borderRadius: "16px", p: 0.5 }}
                        fullWidth
                    >
                        <ToggleButton value="single" sx={{ border: "none", borderRadius: "12px" }}><CalendarTodayIcon sx={{mr:1}}/> Single Day</ToggleButton>
                        <ToggleButton value="multi" sx={{ border: "none", borderRadius: "12px" }}><DateRangeIcon sx={{mr:1}}/> Multi-Day</ToggleButton>
                    </ToggleButtonGroup>

                    <TextField select fullWidth variant="filled" label="Service Type" value={form.bookingCategory} onChange={(e) => setForm({...form, bookingCategory: e.target.value, seatNumber: ""})}>
                        <MenuItem value="Seat Booking">Seat Booking (Shared)</MenuItem>
                        <MenuItem value="Full Booking">Full Van (Private)</MenuItem>
                    </TextField>

                    <TextField fullWidth label="Full Name" variant="filled" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
                    <TextField fullWidth label="Mobile Number" variant="filled" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} />
                    
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                        <TextField type="date" fullWidth label="Travel Date" variant="filled" value={form.bookingDate} InputLabelProps={{ shrink: true }} onChange={e => setForm({...form, bookingDate: e.target.value, vanId: "", seatNumber: ""})} />
                        {form.tripType === "multi" && (
                            <TextField type="date" fullWidth label="Return Date" variant="filled" value={form.returnDate} InputLabelProps={{ shrink: true }} onChange={e => setForm({...form, returnDate: e.target.value})} />
                        )}
                    </Stack>
                  </Stack>
                )}

                {/* STEP 1: VEHICLE LIST (Vertical List) */}
                {activeStep === 1 && (
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={800}>Select Vehicle</Typography>
                    {loading ? <LinearProgress /> : (
                      <Stack spacing={2}>
                        {vanList.length === 0 ? <Alert severity="info">No available vans for these dates.</Alert> : 
                          vanList.map(v => (
                          <Card key={v._id} sx={{ 
                            borderRadius: "16px", 
                            border: form.vanId === v._id ? `2px solid ${PALETTE.primary.main}` : `1px solid ${PALETTE.ui.border}`,
                            bgcolor: form.vanId === v._id ? PALETTE.primary.light : "#fff" 
                          }}>
                            <CardActionArea onClick={() => setForm({...form, vanId: v._id, vanName: v.vanname})} sx={{ p: 2 }}>
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Avatar variant="rounded" src={v.Image?.[0]} sx={{ width: 80, height: 60, bgcolor: "#fff", p: 0.5, border: `1px solid ${PALETTE.ui.border}` }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={800}>{v.vanname}</Typography>
                                        <Typography variant="caption" color="text.secondary">{v.seatType} Seater Vehicle</Typography>
                                    </Box>
                                    {form.vanId === v._id && <CheckCircleIcon color="primary" />}
                                </Stack>
                            </CardActionArea>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}

                {/* STEP 2: SEATS (Horizontal Wrap) */}
                {activeStep === 2 && (
                  <Box textAlign="center">
                    {form.bookingCategory === "Full Booking" ? (
                      <Fade in>
                        <Box sx={{ mt: 5, p: 4, border: `2px dashed ${PALETTE.status.success}`, borderRadius: "24px", bgcolor: "#f0fdf4" }}>
                          <CheckCircleIcon sx={{ fontSize: 60, color: PALETTE.status.success, mb: 2 }} />
                          <Typography variant="h5" fontWeight={800}>Full Van Reserved</Typography>
                          <Typography color="text.secondary">All seats are yours.</Typography>
                        </Box>
                      </Fade>
                    ) : (
                      <Stack spacing={3} alignItems="center">
                        <Typography variant="h6" fontWeight={800}>Available Seats</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center", maxWidth: 500 }}>
                            {[...Array(Number(selectedVan?.seatType || 14))].map((_, i) => {
                              const seatId = (i + 1).toString();
                              const isTaken = bookedSeats.includes(seatId);
                              if (isTaken) return null;
                              return (
                                <Button
                                  key={seatId}
                                  variant={form.seatNumber === seatId ? "contained" : "outlined"}
                                  onClick={() => setForm({...form, seatNumber: seatId})}
                                  sx={{ borderRadius: "12px", minWidth: 80, height: 50, fontWeight: 700 }}
                                >
                                  #{seatId}
                                </Button>
                              );
                            })}
                        </Box>
                      </Stack>
                    )}
                  </Box>
                )}

                {/* STEP 3: REVIEW */}
                {activeStep === 3 && (
                  <Stack spacing={4}>
                    <Alert icon={<VerifiedUserIcon />} severity="success">Please confirm your selection</Alert>
                    <OrderSummary form={form} van={selectedVan} />
                  </Stack>
                )}
              </Box>

              <Box sx={{ p: 3, borderTop: `1px solid ${PALETTE.ui.border}`, display: "flex", justifyContent: "space-between" }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)} startIcon={<ArrowBackIosNewIcon />}>Back</Button>
                <Button variant="contained" onClick={activeStep === 3 ? handleFinalSubmit : handleNext} disabled={submitting} sx={{ borderRadius: "12px", px: 4 }}>
                  {submitting ? <CircularProgress size={24} color="inherit" /> : (activeStep === 3 ? "Confirm & Book" : "Next")}
                </Button>
              </Box>
            </Paper>
          </Box>

          {!isMobile && (
            <Box sx={{ width: 360, position: "sticky", top: 20 }}>
              <OrderSummary form={form} van={selectedVan} />
            </Box>
          )}

        </Stack>
      </Container>
    </Box>
  );
};

export default RequestForm;