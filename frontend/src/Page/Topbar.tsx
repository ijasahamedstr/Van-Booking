import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Modal,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  Phone,
  Email,
  WhatsApp,
  Facebook,
  Instagram,
  YouTube,
  Close as CloseIcon,
} from "@mui/icons-material";

const inquiryTypes = [
  { value: "Payment Issue", label: "Payment Issue" },
  { value: "Product Issue", label: "Product Issue" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Request Service", label: "Request Service" },
];

/* ---------------- FONT ---------------- */
const CURSIVE = "cursive";

/* ---------------- CART KEYS ---------------- */

const Topbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [open, setOpen] = useState(false);
  const [socialDrawerOpen, setSocialDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    type: "",
    description: "",
    orderNumber: "",
    orderDate: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const onOpenInquiry = () => handleOpen();
    window.addEventListener("openInquiry", onOpenInquiry);
    return () => window.removeEventListener("openInquiry", onOpenInquiry);
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      type: "",
      description: "",
      orderNumber: "",
      orderDate: "",
    });
  };

  const openWhatsApp = () => {
    const message = `
*New Inquiry Received*

*Name:* ${formData.name || "N/A"}
*Mobile:* ${formData.mobile || "N/A"}
*Inquiry Type:* ${formData.type || "N/A"}
*Order Number:* ${formData.orderNumber || "N/A"}
*Order Date:* ${formData.orderDate || "N/A"}

*Description:* 
${formData.description || "N/A"}
    `;
    window.open(
      `https://wa.me/94767080553?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleSaveAndShare = async () => {
    if (!formData.name || !formData.mobile || !formData.type) {
      setSnackbar({
        open: true,
        message: "Please fill Name, Mobile and Inquiry Type.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      openWhatsApp();
      resetForm();
      handleClose();
      setLoading(false);
    }, 500);
  };

  const handleSnackbarClose = () =>
    setSnackbar((s) => ({ ...s, open: false }));

  const textFieldCommon = {
    InputLabelProps: { sx: { fontFamily: CURSIVE } },
    InputProps: { sx: { fontFamily: CURSIVE } },
    sx: { mb: 2 },
  } as const;

  return (
    <>
      {/* TOP BAR */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 50, sm: 55, md: 60 },
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1200,
          bgcolor: "#222",
          display: "flex",
          fontFamily: CURSIVE,
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            width: isMobile ? "55%" : "75%",
            display: "flex",
            alignItems: "center",
            px: { xs: 1, sm: 2, md: 4 },
            color: "#fff",
            gap: 1,
            overflow: "hidden",
            fontFamily: CURSIVE,
          }}
        >
          <Typography sx={{ fontWeight: 600, whiteSpace: "nowrap", fontFamily: CURSIVE  }}>
            Need Assistance? Contact Us:
          </Typography>

          {!isMobile && (
            <>
              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ mr: 0.5 }} />
                <Link
                  href="tel:+94767080553"
                  underline="none"
                  color="inherit"
                  sx={{ fontFamily: CURSIVE }}
                >
                  (+94) 76 708 0553
                </Link>
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ mr: 0.5 }} />
                <Link
                  href="mailto:info@mrfresh.lk"
                  underline="none"
                  color="inherit"
                  sx={{ fontFamily: CURSIVE }}
                >
                  info@mrfresh.lk
                </Link>
              </Typography>
            </>
          )}
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            width: isMobile ? "45%" : "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 2,
            gap: 1,
            fontFamily: CURSIVE,
          }}
        >
          {(isMobile || isTablet) && (
            <IconButton onClick={() => setSocialDrawerOpen(true)} sx={{ color: "#fff" }}>
              <WhatsApp />
            </IconButton>
          )}

          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              textTransform: "none",
              background:
                "linear-gradient(135deg, #c2d142 0%, #a8bb2f 100%)",
              color: "#1f2937",
              fontWeight: 600,
              borderRadius: "50px",
              fontFamily: CURSIVE,
            }}
          >
            Inquire Here
          </Button>
        </Box>
      </Box>

      {/* SOCIAL DRAWER */}
      <Drawer
        anchor="right"
        open={socialDrawerOpen}
        onClose={() => setSocialDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            p: 2,
            bgcolor: "#111827",
            color: "#fff",
            fontFamily: CURSIVE,
          },
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Follow us
        </Typography>
        {[WhatsApp, Facebook, Instagram, YouTube].map((Icon, i) => (
          <Button
            key={i}
            startIcon={<Icon />}
            sx={{
              justifyContent: "flex-start",
              color: "#fff",
              textTransform: "none",
              fontFamily: CURSIVE,
            }}
          >
            {Icon.name}
          </Button>
        ))}
      </Drawer>

      {/* MODAL */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 },
            bgcolor: "#fff",
            borderRadius: 2,
            p: 2,
            fontFamily: CURSIVE,
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Inquiry Form
          </Typography>

          <TextField fullWidth label="Name" name="name" {...textFieldCommon} />
          <TextField fullWidth label="Mobile" name="mobile" {...textFieldCommon} />

          <TextField
            fullWidth
            select
            label="Inquiry Type"
            name="type"
            {...textFieldCommon}
          >
            {inquiryTypes.map((o) => (
              <MenuItem key={o.value} value={o.value} sx={{ fontFamily: CURSIVE }}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            {...textFieldCommon}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveAndShare}
            sx={{ fontFamily: CURSIVE }}
          >
            {loading ? <CircularProgress size={20} /> : "Save & Send to WhatsApp"}
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ fontFamily: CURSIVE }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Topbar;
