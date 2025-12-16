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
  "Emergency Service", // ✅ NEW
];

/* ---------------- VAN LIST ---------------- */
const vans = ["Luxury Van", "Executive Van", "Mini Van"];

/* ---------------- ADMIN WHATSAPP ---------------- */
const ADMIN_WHATSAPP = "966594796823";

const RequestForm: React.FC = () => {
  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    requestType: "",
    bookingDate: "",
    van: "",
    seatNumber: "",
    description: "",
    emergencyReason: "", // ✅ NEW
    emergencyArea: "", // ✅ NEW
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
    form.requestType === "Emergency Service"; // ✅ NEW

  const showDate =
    isFullBooking || isEventBooking || isCancelFull || isCancelSeat;
  const showVan =
    isFullBooking || isEventBooking || isCancelFull || isCancelSeat;

  /* ---------------- WHATSAPP ---------------- */
  const openWhatsApp = () => {
    const message = `
*🚨 New Inquiry Received 🚨*

*Name:* ${form.customerName || "N/A"}
*Mobile:* ${form.mobileNumber || "N/A"}
*Request Type:* ${form.requestType || "N/A"}

${showDate ? `*Booking Date:* ${form.bookingDate || "N/A"}` : ""}
${showVan ? `*Van:* ${form.van || "N/A"}` : ""}
${form.seatNumber ? `*Seat Number:* ${form.seatNumber}` : ""}

${
  isEmergency
    ? `*Emergency Reason:* ${form.emergencyReason || "N/A"}
*Area / City:* ${form.emergencyArea || "N/A"}`
    : ""
}

*Description:*
${form.description || "N/A"}

_Sent via Van Request Form_
    `;

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      const resp = await fetch(`${API_HOST}/Request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message);

      await Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Your request has been saved successfully.",
        confirmButtonColor: "#4CAF50",
      });

      Swal.fire({
        icon: "info",
        title: "Please Wait",
        text: "Customer waiting for admin reply ⏳",
        showConfirmButton: false,
        timer: 2000,
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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Request not saved. WhatsApp not sent.",
      });
    }
  };

  const fieldStyle = { fontFamily: CURSIVE_FONT };

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
            InputProps={{ sx: fieldStyle }}
            InputLabelProps={{ sx: fieldStyle }}
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            margin="normal"
            InputProps={{ sx: fieldStyle }}
            InputLabelProps={{ sx: fieldStyle }}
          />

          <TextField
            select
            fullWidth
            label="Request Type"
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            margin="normal"
            InputProps={{ sx: fieldStyle }}
            InputLabelProps={{ sx: fieldStyle }}
          >
            {requestTypes.map((type) => (
              <MenuItem key={type} value={type} sx={fieldStyle}>
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
              InputLabelProps={{ shrink: true, sx: fieldStyle }}
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
              InputProps={{ sx: fieldStyle }}
              InputLabelProps={{ sx: fieldStyle }}
            >
              {vans.map((van) => (
                <MenuItem key={van} value={van} sx={fieldStyle}>
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
              InputProps={{ sx: fieldStyle }}
            />
          )}

          {/* ✅ EMERGENCY FIELDS */}
          {isEmergency && (
            <>
              <TextField
                fullWidth
                label="Emergency Reason"
                name="emergencyReason"
                value={form.emergencyReason}
                onChange={handleChange}
                margin="normal"
                InputProps={{ sx: fieldStyle }}
              />

              <TextField
                fullWidth
                label="Area / City"
                name="emergencyArea"
                value={form.emergencyArea}
                onChange={handleChange}
                margin="normal"
                InputProps={{ sx: fieldStyle }}
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
            InputProps={{ sx: fieldStyle }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              fontFamily: CURSIVE_FONT,
              fontSize: 18,
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
