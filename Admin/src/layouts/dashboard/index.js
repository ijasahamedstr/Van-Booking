import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";

/* ================= CARD STYLE ================= */
const cardStyle = {
  borderRadius: "22px",
  overflow: "hidden",
  background: "#ffffff",
  boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
  transition: "all 0.35s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 55px rgba(0,0,0,0.25)",
  },
};

/* ================= IMAGE CONTAINER ================= */
const imageWrapper = {
  height: {
    xs: 220,
    md: 260,
    lg: 300, // 🔥 BIGGER HEIGHT
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8f9fa",
};

/* ================= IMAGE STYLE ================= */
const imageSx = {
  maxWidth: "85%",
  maxHeight: "85%",
  objectFit: "contain", // ✅ IMPORTANT
};

/* ================= CONTENT STYLE ================= */
const contentStyle = {
  p: 2.5,
  textAlign: "center",
};

function Dashboard() {
  const [vanSection, setVanSection] = useState([]);
  const [vanBooking, setVanBooking] = useState([]);
  const [vanBookingRequest, setVanBookingRequest] = useState([]);
  const [inquireSection, setInquireSection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/VanSection`)
      .then((res) => res.json())
      .then(setVanSection);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/VanBooking`)
      .then((res) => res.json())
      .then(setVanBooking);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/VanBookingSpecialRequest`)
      .then((res) => res.json())
      .then(setVanBookingRequest);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/Inquire`)
      .then((res) => res.json())
      .then(setInquireSection);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* ================= VAN SECTION ================= */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox sx={cardStyle}>
              <MDBox sx={imageWrapper}>
                <MDBox
                  component="img"
                  src="https://i.ibb.co/Wv2z7Jd0/Gemini-Generated-Image-1ltd7r1ltd7r1ltd-removebg-preview.png"
                  alt="Van Section"
                  sx={imageSx}
                />
              </MDBox>
              <MDBox sx={contentStyle}>
                <MDTypography variant="h6">Van Section</MDTypography>
                <MDTypography variant="h3" color="primary">
                  {vanSection.length}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          {/* ================= VAN BOOKING ================= */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox sx={cardStyle}>
              <MDBox sx={imageWrapper}>
                <MDBox
                  component="img"
                  src="https://i.ibb.co/hxChYFH9/istockphoto-1742244777-612x612-removebg-preview.png"
                  alt="Van Booking"
                  sx={imageSx}
                />
              </MDBox>
              <MDBox sx={contentStyle}>
                <MDTypography variant="h6">Van Booking</MDTypography>
                <MDTypography variant="h3" color="success">
                  {vanBooking.length}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          {/* ================= SPECIAL REQUEST ================= */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox sx={cardStyle}>
              <MDBox sx={imageWrapper}>
                <MDBox
                  component="img"
                  src="https://i.ibb.co/zTcsZfQg/Gemini-Generated-Image-an9h0uan9h0uan9h-removebg-preview.png"
                  alt="Special Request"
                  sx={imageSx}
                />
              </MDBox>
              <MDBox sx={contentStyle}>
                <MDTypography variant="h6">Special Requests</MDTypography>
                <MDTypography variant="h3" color="warning">
                  {vanBookingRequest.length}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>

          {/* ================= INQUIRE SECTION ================= */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox sx={cardStyle}>
              <MDBox sx={imageWrapper}>
                <MDBox
                  component="img"
                  src="https://i.ibb.co/gLgHyRJS/127-1277563-enquiries-telemarketing-icon-removebg-preview.png"
                  alt="Inquiry"
                  sx={imageSx}
                />
              </MDBox>
              <MDBox sx={contentStyle}>
                <MDTypography variant="h6">Inquire Section</MDTypography>
                <MDTypography variant="h3" color="error">
                  {inquireSection.length}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
