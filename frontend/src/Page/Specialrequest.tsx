import React, { useState } from "react";
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
const CURSIVE_FONT = "cursive";

/* ---------------- REQUEST TYPES ---------------- */
const requestTypes = [
  "Van Not Available – Need Full Booking",
  "Van For Event Booking",
  "Cancel Full Booking",
  "Cancel Seat Booking",
  "Emergency Service",
];

/* ---------------- VAN LIST ---------------- */
const vans = ["Luxury Van", "Executive Van", "Mini Van"];

/* ---------------- ADMIN WHATSAPP ---------------- */
const ADMIN_WHATSAPP = "966594796823";

/* ---------------- FIELD STYLE ---------------- */
const fieldSx = {
  fontFamily: CURSIVE_FONT,
  "& .MuiInputBase-input": {
    fontFamily: CURSIVE_FONT,
  },
  "& .MuiInputLabel-root": {
    fontFamily: CURSIVE_FONT,
  },
  "& .MuiSelect-select": {
    fontFamily: CURSIVE_FONT,
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

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- CONDITIONS ---------------- */
  const isFullBooking =
    form.requestType === "Van Not Available – Need Full Booking";
  const isEventBooking =
    form.requestType === "Van For Event Booking";
  const isCancelFull =
    form.requestType === "Cancel Full Booking";
  const isCancelSeat =
    form.requestType === "Cancel Seat Booking";
  const isEmergency =
    form.requestType === "Emergency Service";

  const showDate =
    isFullBooking || isEventBooking || isCancelFull || isCancelSeat;
  const showVan =
    isFullBooking || isEventBooking || isCancelFull || isCancelSeat;

  /* ---------------- WHATSAPP ---------------- */
  const openWhatsApp = () => {
    const message = `
🚨 New Inquiry 🚨

Name: ${form.customerName}
Mobile: ${form.mobileNumber}
Type: ${form.requestType}

${showDate ? `Booking Date: ${form.bookingDate}` : ""}
${showVan ? `Van: ${form.van}` : ""}
${form.seatNumber ? `Seat Number: ${form.seatNumber}` : ""}

${
  isEmergency
    ? `Emergency Reason: ${form.emergencyReason}
Area / City: ${form.emergencyArea}`
    : ""
}

Description:
${form.description}
    `;

    window.open(
      `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  /* ---------------- SUBMIT ---------------- */
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
        fontFamily: CURSIVE_FONT,
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            mb={3}
            fontWeight={700}
            sx={{ fontFamily: CURSIVE_FONT }}
          >
            Van Request Form
          </Typography>

          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            margin="normal"
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            margin="normal"
            sx={fieldSx}
          />

          <TextField
            select
            fullWidth
            label="Request Type"
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            margin="normal"
            sx={fieldSx}
          >
            {requestTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ fontFamily: CURSIVE_FONT }}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {showDate && (
            <TextField
              fullWidth
              type="date"
              label="Booking Date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              margin="normal"
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          )}

          {showVan && (
            <TextField
              select
              fullWidth
              label="Select Van"
              name="van"
              value={form.van}
              onChange={handleChange}
              margin="normal"
              sx={fieldSx}
            >
              {vans.map((van) => (
                <MenuItem key={van} value={van} sx={{ fontFamily: CURSIVE_FONT }}>
                  {van}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isCancelSeat && (
            <TextField
              fullWidth
              label="Seat Number"
              name="seatNumber"
              value={form.seatNumber}
              onChange={handleChange}
              margin="normal"
              sx={fieldSx}
            />
          )}

          {isEmergency && (
            <>
              <TextField
                fullWidth
                label="Emergency Reason"
                name="emergencyReason"
                value={form.emergencyReason}
                onChange={handleChange}
                margin="normal"
                sx={fieldSx}
              />

              <TextField
                fullWidth
                label="Area / City"
                name="emergencyArea"
                value={form.emergencyArea}
                onChange={handleChange}
                margin="normal"
                sx={fieldSx}
              />
            </>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            sx={fieldSx}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              fontFamily: CURSIVE_FONT,
              fontSize: 18,
              textTransform: "none",
            }}
            onClick={handleSubmit}
          >
            Submit Request
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RequestForm;
