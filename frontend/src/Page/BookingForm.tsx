import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Swal from "sweetalert2";

/* ================= ENV ================= */
const API_HOST = import.meta.env.VITE_API_HOST as string;

/* ================= FONT ================= */
const MONTSERRAT = '"Montserrat", sans-serif';

/* ================= TYPES ================= */
interface Van {
  _id: string;
  vanname: string;
  Image: string[];
}

/* ================= BOOKING TYPES ================= */
const bookingTypes = [
  "Full Booking",
  "Seat Booking",
  "Emergency Booking",
  "Event Booking",
];

const specialBookings = ["Emergency Booking", "Event Booking"];

/* ================= SEAT TYPES ================= */
type SeatStatus = "available" | "processing" | "counter" | "booked";

interface Seat {
  number: number;
  status: SeatStatus;
}

/* ================= COLORS ================= */
const SEAT_COLORS: Record<SeatStatus | "selected", string> = {
  available: "#ffffff",
  processing: "#16a34a",
  counter: "#f97316",
  booked: "#dc2626",
  selected: "#2563eb",
};

/* ================= COMPONENT ================= */
const RequestForm: React.FC = () => {
  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    bookingDate: "",
    bookingCategory: "",
    van: "",
    seatNumber: "",
  });

  const [vanList, setVanList] = useState<Van[]>([]);

  /* ===== DEMO SEAT MAP ===== */
  const seatMap: (Seat | null)[] = [
    { number: 1, status: "available" },
    { number: 2, status: "booked" },
    null,
    { number: 3, status: "available" },
    { number: 4, status: "counter" },
    { number: 5, status: "available" },
    { number: 6, status: "processing" },
    null,
    { number: 7, status: "booked" },
    { number: 8, status: "available" },
  ];

  /* ================= FETCH VANS ================= */
  useEffect(() => {
    const fetchVans = async () => {
      const res = await fetch(`${API_HOST}/Vanaddinfo`);
      const data = await res.json();
      setVanList(Array.isArray(data) ? data : []);
    };
    fetchVans();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "bookingCategory" && specialBookings.includes(value)) {
      Swal.fire("Info", "Use special request form", "info");
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const selectVan = (vanName: string) => {
    setForm((p) => ({
      ...p,
      van: vanName,
      seatNumber: "", // reset seat when van changes
    }));
  };

  const selectSeat = (seat: Seat) => {
    if (seat.status !== "available") return;
    setForm((p) => ({ ...p, seatNumber: seat.number.toString() }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (form.bookingCategory === "Seat Booking") {
      if (!form.van || !form.seatNumber) {
        Swal.fire("Incomplete", "Please select van and seat", "warning");
        return;
      }
    }

    Swal.fire("Success", "Booking submitted successfully", "success");
  };

  const isSeatBooking = form.bookingCategory === "Seat Booking";
  const isFullBooking = form.bookingCategory === "Full Booking";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020617",
        py: 6,
        fontFamily: MONTSERRAT,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#fff", p: 4, borderRadius: 4 }}>
          <Typography variant="h4" textAlign="center" mb={3} fontWeight={800}>
            Van Booking Form
          </Typography>

          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            type="date"
            fullWidth
            label="Booking Date"
            name="bookingDate"
            value={form.bookingDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />

          {form.bookingDate && (
            <TextField
              select
              fullWidth
              label="Booking Type"
              name="bookingCategory"
              value={form.bookingCategory}
              onChange={handleChange}
              margin="normal"
            >
              {bookingTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* ================= VAN SELECT ================= */}
          {(isSeatBooking || isFullBooking) && (
            <Box mt={4}>
              <Typography fontWeight={700} mb={2}>
                Select Available Van
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px,1fr))",
                  gap: 2,
                }}
              >
                {vanList.map((van) => (
                  <Card
                    key={van._id}
                    sx={{
                      border:
                        form.van === van.vanname
                          ? "2px solid #2563eb"
                          : "1px solid #e5e7eb",
                    }}
                  >
                    <CardActionArea onClick={() => selectVan(van.vanname)}>
                      <CardMedia
                        component="img"
                        image={van.Image?.[0]}
                        sx={{
                          height: 120,
                          objectFit: "contain",
                          p: 1.5,
                          bgcolor: "#f8fafc",
                        }}
                      />
                      <CardContent>
                        <Typography textAlign="center" fontWeight={700}>
                          {van.vanname}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* ================= SEAT LAYOUT ================= */}
          {isSeatBooking && form.van && (
            <Box mt={4}>
              <Typography fontWeight={700} mb={2}>
                Select Seat
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 46px)",
                  gap: 1.5,
                }}
              >
                {seatMap.map((seat, i) =>
                  seat ? (
                    <Box
                      key={i}
                      onClick={() => selectSeat(seat)}
                      sx={{
                        width: 46,
                        height: 46,
                        border: "1px solid #000",
                        borderRadius: 1,
                        bgcolor:
                          form.seatNumber === seat.number.toString()
                            ? SEAT_COLORS.selected
                            : SEAT_COLORS[seat.status],
                        color:
                          seat.status === "available" &&
                          form.seatNumber !== seat.number.toString()
                            ? "#000"
                            : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor:
                          seat.status === "available"
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      {seat.number}
                    </Box>
                  ) : (
                    <Box key={i} />
                  )
                )}
              </Box>
            </Box>
          )}

          <Button
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 3,
              bgcolor: "#f97316",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { bgcolor: "#ea580c" },
            }}
          >
            Proceed
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RequestForm;
