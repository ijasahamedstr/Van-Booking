import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

/* ================= ADMIN CONSTANTS ================= */
const ADMIN_NAME = "ASHARY TRAVELS & TOURISUM";
const ADMIN_MOBILE = "0768696704";

function InquirySectionView() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [reply, setReply] = useState("");

  const apiBase = process.env.REACT_APP_API_HOST;

  /* ================= FETCH INQUIRIES ================= */
  useEffect(() => {
    axios
      .get(`${apiBase}/inquiry`)
      .then((res) => {
        setInquiries(res.data.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiBase]);

  /* ================= OPEN POPUP ================= */
  const handleOpen = (item) => {
    setSelectedInquiry(item);
    setReply("");
    setOpen(true);
  };

  /* ================= FORMAT CUSTOMER NUMBER ================= */
  const formatCustomerNumber = (mobile = "") => {
    return mobile.replace(/\D/g, "").replace(/^0/, "94");
  };

  /* ================= OPEN WHATSAPP (CUSTOMER NUMBER) ================= */
  const openWhatsAppReply = (inquiry, replyMessage) => {
    const message = `
*New Inquiry Reply*

*From:* ${ADMIN_NAME}
*Admin Mobile:* ${ADMIN_MOBILE}

*Customer Name:* ${inquiry.name || "N/A"}
*Customer Mobile:* ${inquiry.mobile || "N/A"}
*Inquiry Type:* ${inquiry.inquirytype || "N/A"}

*Admin Reply:*
${replyMessage}

_Thank you_
*${ADMIN_NAME}*
    `;

    // ✅ SEND TO CUSTOMER NUMBER
    const phoneNumber = formatCustomerNumber(inquiry.mobile);

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  /* ================= SAVE → SEND ================= */
  const handleSend = async () => {
    if (!reply.trim()) {
      alert("Please enter reply message");
      return;
    }

    try {
      // 1️⃣ SAVE REPLY TO DATABASE
      await axios.post(`${apiBase}/inquiry/reply`, {
        inquiryId: selectedInquiry._id,
        adminName: ADMIN_NAME,
        adminMobile: ADMIN_MOBILE,
        replyMessage: reply,
      });

      // 2️⃣ SEND WHATSAPP TO CUSTOMER
      openWhatsAppReply(selectedInquiry, reply);

      setOpen(false);
      alert("Reply saved & WhatsApp sent to customer");
    } catch (error) {
      console.error(error);
      alert("Failed to send reply");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Type", accessor: "type" },
    { Header: "Action", accessor: "action" },
  ];

  const rows = inquiries.map((item) => ({
    name: item.name,
    mobile: item.mobile,
    type: item.inquirytype,
    action: (
      <Button size="small" variant="contained" color="success" onClick={() => handleOpen(item)}>
        Reply
      </Button>
    ),
  }));

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={6} textAlign="center">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6}>
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <DataTable table={{ columns, rows }} entriesPerPage={8} pagination />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* ================= POPUP FORM ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Send WhatsApp Reply</DialogTitle>

        <DialogContent>
          <MDTypography variant="caption" display="block">
            Customer: {selectedInquiry?.name}
          </MDTypography>

          <MDTypography variant="caption" display="block">
            Mobile: {selectedInquiry?.mobile}
          </MDTypography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reply Message"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            margin="normal"
            placeholder="Type admin reply..."
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSend}>
            Save & Send WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default InquirySectionView;
