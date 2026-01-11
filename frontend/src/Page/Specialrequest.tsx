import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
} from "@mui/material";
import Swal from "sweetalert2";

/* ---------------- ENV ---------------- */
const API_HOST = import.meta.env.VITE_API_HOST as string;

/* ---------------- FONT ---------------- */
const MONTSERRAT = '"Montserrat", sans-serif';

/* ---------------- REQUEST TYPES ---------------- */
const requestTypes = [
  "Van Not Available – Need Full Booking",
  "Van For Event Booking",
  "Cancel Full Booking",
  "Cancel Seat Booking",
  "Emergency Service",
];

/* ---------------- ADMIN WHATSAPP ---------------- */
const ADMIN_WHATSAPP = "966594796823";

/* ---------------- FIELD STYLE (3D INPUT) ---------------- */
const fieldSx = {
  fontFamily: MONTSERRAT,
  "& .MuiInputBase-root": {
    borderRadius: 3,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.8))",
    boxShadow:
      "inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.9)",
    transition: "all 0.3s ease",
  },
  "& .MuiInputBase-root:hover": {
    transform: "translateY(-1px)",
  },
  "& .MuiInputBase-input": {
    fontFamily: MONTSERRAT,
    padding: "15px",
  },
  "& .MuiInputLabel-root": {
    fontFamily: MONTSERRAT,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

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

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch(`${API_HOST}/Vanaddinfo`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setVanList(Array.isArray(data) ? data.map((v) => v.vanname) : []);
      } catch {
        console.error("Failed to load vans");
      }
    };
    fetchVans();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFullBooking = form.requestType === "Van Not Available – Need Full Booking";
  const isEventBooking = form.requestType === "Van For Event Booking";
  const isCancelFull = form.requestType === "Cancel Full Booking";
  const isCancelSeat = form.requestType === "Cancel Seat Booking";
  const isEmergency = form.requestType === "Emergency Service";

  const showDate = isFullBooking || isEventBooking || isCancelFull || isCancelSeat;
  const showVan = showDate;

  const openWhatsApp = () => {
    const message = `
🚐 New Van Request

Name: ${form.customerName}
Mobile: ${form.mobileNumber}
Type: ${form.requestType}

${showDate ? `Booking Date: ${form.bookingDate}` : ""}
${showVan ? `Van: ${form.van}` : ""}
${form.seatNumber ? `Seat Number: ${form.seatNumber}` : ""}

${isEmergency ? `Emergency Reason: ${form.emergencyReason}\nArea: ${form.emergencyArea}` : ""}

Description:
${form.description}
    `;
    window.open(
      `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleSubmit = async () => {
    try {
      const resp = await fetch(`${API_HOST}/Request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error();

      await Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Your request has been sent successfully",
      });

      openWhatsApp();

      setForm({
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1e293b, #020617)",
        perspective: "1400px",
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            borderRadius: 5,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.85))",
            boxShadow:
              "20px 20px 50px rgba(0,0,0,0.45), -10px -10px 25px rgba(255,255,255,0.4)",
            transformStyle: "preserve-3d",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "rotateX(2deg) rotateY(-2deg) translateY(-6px)",
            },
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            mb={3}
            fontWeight={700}
            sx={{ fontFamily: MONTSERRAT }}
          >
           Van Request Form
          </Typography>

          <TextField fullWidth label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} margin="normal" sx={fieldSx} />
          <TextField fullWidth label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} margin="normal" sx={fieldSx} />

          <TextField select fullWidth label="Request Type" name="requestType" value={form.requestType} onChange={handleChange} margin="normal" sx={fieldSx}>
            {requestTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ fontFamily: MONTSERRAT }}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {showDate && (
            <TextField type="date" fullWidth label="Booking Date" name="bookingDate" value={form.bookingDate} onChange={handleChange} margin="normal" sx={fieldSx} InputLabelProps={{ shrink: true }} />
          )}

          {showVan && (
            <TextField select fullWidth label="Select Van" name="van" value={form.van} onChange={handleChange} margin="normal" sx={fieldSx}>
              {vanList.map((van) => (
                <MenuItem key={van} value={van} sx={{ fontFamily: MONTSERRAT }}>
                  {van}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isCancelSeat && (
            <TextField fullWidth label="Seat Number" name="seatNumber" value={form.seatNumber} onChange={handleChange} margin="normal" sx={fieldSx} />
          )}

          {isEmergency && (
            <>
              <TextField fullWidth label="Emergency Reason" name="emergencyReason" value={form.emergencyReason} onChange={handleChange} margin="normal" sx={fieldSx} />
              <TextField fullWidth label="Area / City" name="emergencyArea" value={form.emergencyArea} onChange={handleChange} margin="normal" sx={fieldSx} />
            </>
          )}

          <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleChange} margin="normal" sx={fieldSx} />

          <Button
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 4,
              fontFamily: MONTSERRAT,
              fontSize: 18,
              textTransform: "none",
              background: "linear-gradient(145deg, #06b6d4, #0ea5e9)",
              boxShadow:
                "0 12px 25px rgba(14,165,233,0.6)",
              transition: "all 0.2s ease",
              "&:active": {
                transform: "translateY(3px)",
                boxShadow: "0 6px 15px rgba(14,165,233,0.5)",
              },
            }}
          >
            Submit Request
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RequestForm;
