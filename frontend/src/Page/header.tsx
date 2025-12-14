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

const Montserrat = '"Montserrat", sans-serif';

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
    "https://i.ibb.co/C5gQQ0vN/Gemini-Generated-Image-gamnzygamnzygamn.png";

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const IconImg = ({ src, bgColor }: { src: string; bgColor?: string }) => (
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        backgroundColor: bgColor || "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
      }}
    >
      <Box component="img" src={src} sx={{ width: 22, height: 22 }} />
    </Box>
  );

  /* ✅ RESPONSIVE COLORS */
  const headerBg = isMobile ? "#ffffff" : "#fbfcfc";
  const drawerBg = isMobile ? "#ffffff" : "#fbfcfc";

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: headerBg, // 👈 responsive
          color: "#000",
          px: { xs: 3, sm: 6, md: 10 },
          mt: "55px",
          fontFamily: Montserrat,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            pt: { xs: 2, md: 3 },
            pb: 1,
          }}
        >
          {/* LOGO */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logoUrl}
              sx={{
                height: { xs: 56, sm: 64, md: 70 },
                width: "auto",
              }}
            />
          </Box>

          {/* MENU ICON */}
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: drawerBg, // 👈 responsive
          },
        }}
      >
        <Box sx={{ width: 280, py: 2, fontFamily: Montserrat }}>
          {/* LOGO */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box component="img" src={logoUrl} sx={{ height: 68 }} />
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
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: Montserrat,
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
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: Montserrat,
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
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: Montserrat,
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
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#25D366",
              fontSize: 14,
              fontWeight: 400,
              fontFamily: Montserrat,
              cursor: "pointer",
            }}
            onClick={() => window.open("https://wa.me/966XXXXXXXXX", "_blank")}
          >
            <WhatsAppIcon fontSize="small" />
            Easy & Fast Van Booking
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
