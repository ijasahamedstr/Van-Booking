import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
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
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import NotesIcon from "@mui/icons-material/Notes";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

/* ---------------- FONT ---------------- */

const Montserrat = '"Montserrat", sans-serif';

/* ---------------- MAIN COMPONENT ---------------- */

export default function EtsyStyleHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const logoUrl =
    "https://i.ibb.co/C5gQQ0vN/Gemini-Generated-Image-gamnzygamnzygamn.png";

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fbfcfc",
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
            pt: { xs: 2, md: 3 }, // 👈 TOP SPACE ONLY
            pb: 1,              // unchanged bottom
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
      >
        <Box
          sx={{
            width: 280,
            py: 2,
            fontFamily: Montserrat,
          }}
        >
          {/* LOGO */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              component="img"
              src={logoUrl}
              sx={{
                height: 68,
                width: "auto",
              }}
            />
          </Box>

          <Divider />

          {/* MENU ITEMS */}
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <DirectionsBusIcon sx={{ mr: 2 }} />
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
              <ListItemButton>
                <EventSeatIcon sx={{ mr: 2 }} />
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
              <ListItemButton>
                <NotesIcon sx={{ mr: 2 }} />
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
          >
            <WhatsAppIcon fontSize="small" />
            Easy & Fast Van Booking
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
