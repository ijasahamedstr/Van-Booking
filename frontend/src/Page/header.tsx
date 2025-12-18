import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useNavigate } from "react-router-dom";

/* ---------------- FONT ---------------- */

const MONTSERRAT = '"Montserrat", sans-serif';

/* ---------------- ICON IMAGES ---------------- */

const ICONS = {
  vanDetails: "https://cdn-icons-png.flaticon.com/512/3774/3774278.png",
  vanBooking: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
  specialRequest: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png",
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function EtsyStyleHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const logoUrl =
    "https://i.ibb.co/HppxBxgP/Gemini-Generated-Image-f3bp5nf3bp5nf3bp.png";

  /* ---------------- HANDLERS ---------------- */

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setDrawerOpen(false);
  };

  const IconImg = ({ src, bgColor }: { src: string; bgColor?: string }) => (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: bgColor || "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
      }}
    >
      <Box component="img" src={src} sx={{ width: 24, height: 24 }} />
    </Box>
  );

  const headerBg = isMobile ? "#ffffff" : "#f9fafb";
  const drawerBg = isMobile ? "#ffffff" : "#fbfcfc";

  return (
    <>
      {/* ================= HEADER ================= */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: headerBg,
          color: "#000",
          px: { xs: 3, sm: 6, md: 10 },
          mt: "55px",
          fontFamily: MONTSERRAT,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 110, sm: 130, md: 150 },
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: MONTSERRAT,
          }}
        >
          {/* LOGO */}
          <Box
            onClick={handleLogoClick}
            sx={{
              width: { xs: 240, sm: 320, md: 450 },
              height: { xs: 90, sm: 110, md: 130 },
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={logoUrl}
              alt="Logo"
              sx={{
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* MENU ICON */}
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ================= DRAWER ================= */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: drawerBg,
            fontFamily: MONTSERRAT,
          },
        }}
      >
        <Box sx={{ width: 300, py: 3, fontFamily: MONTSERRAT }}>
          {/* DRAWER LOGO */}
          <Box
            onClick={handleLogoClick}
            sx={{
              width: 320,
              height: 140,
              mx: "auto",
              mb: 3,
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={logoUrl}
              alt="Logo"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Divider />

          {/* MENU ITEMS */}
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/van-details")}>
                <IconImg src={ICONS.vanDetails} />
                <ListItemText
                  primary="Van Details"
                  primaryTypographyProps={{
                    fontSize: 17,
                    fontWeight: 500,
                    fontFamily: MONTSERRAT,
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/van-booking")}>
                <IconImg src={ICONS.vanBooking} bgColor="#E3F2FD" />
                <ListItemText
                  primary="Van Booking"
                  primaryTypographyProps={{
                    fontSize: 17,
                    fontWeight: 500,
                    fontFamily: MONTSERRAT,
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/special-request")}>
                <IconImg src={ICONS.specialRequest} />
                <ListItemText
                  primary="Special Request"
                  primaryTypographyProps={{
                    fontSize: 17,
                    fontWeight: 500,
                    fontFamily: MONTSERRAT,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          {/* WHATSAPP */}
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#25D366",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: MONTSERRAT,
              cursor: "pointer",
            }}
            onClick={() => window.open("https://wa.me/966XXXXXXXXX", "_blank")}
          >
            <WhatsAppIcon />
            Easy & Fast Van Booking
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
