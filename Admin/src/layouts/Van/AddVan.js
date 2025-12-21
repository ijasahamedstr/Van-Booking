import React, { useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function AddVan() {
  const [loading, setLoading] = useState(false);

  const [van, setVan] = useState({
    vanname: "",
    Seat: "",
    Type: "",
    type2: "",
    Image: [],
  });

  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState({});

  const apiBase = process.env.REACT_APP_API_HOST || "";

  /* ---------------- IMAGE VALIDATION ---------------- */
  const isImageUrl = (url) => {
    try {
      const u = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(u.pathname);
    } catch {
      return false;
    }
  };

  const imagePreview = useMemo(() => van.Image.filter((img) => isImageUrl(img)), [van.Image]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVan((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;

    if (!isImageUrl(url)) {
      setErrors((prev) => ({ ...prev, Image: "Invalid image URL" }));
      return;
    }

    if (van.Image.includes(url)) {
      setErrors((prev) => ({ ...prev, Image: "Image already added" }));
      return;
    }

    setVan((prev) => ({ ...prev, Image: [...prev.Image, url] }));
    setImageInput("");
    setErrors((prev) => ({ ...prev, Image: "" }));
  };

  const removeImage = (idx) => {
    setVan((prev) => ({
      ...prev,
      Image: prev.Image.filter((_, i) => i !== idx),
    }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    if (!van.vanname.trim()) e.vanname = "Van name is required";
    if (!van.Seat) e.Seat = "Seat count is required";
    if (isNaN(Number(van.Seat))) e.Seat = "Seat must be numeric";
    if (!van.Type) e.Type = "Select AC type";
    if (!van.type2) e.type2 = "Select transmission";
    if (van.Image.length === 0) e.Image = "Add at least one image";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    Swal.fire({
      title: "Saving...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = {
        ...van,
        Seat: Number(van.Seat),
        date: new Date().toISOString().split("T")[0],
      };

      await axios.post(`${apiBase}/Vanaddinfo`, payload);

      Swal.close();
      await Swal.fire("Success", "Van added successfully", "success");

      setVan({ vanname: "", Seat: "", Type: "", type2: "", Image: [] });
      setImageInput("");
      setErrors({});
    } catch (err) {
      Swal.close();
      Swal.fire("Error", err?.response?.data?.message || "Failed to add van", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add New Van
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} pb={3}>
                <form onSubmit={handleSubmit}>
                  {/* Van Name */}
                  <TextField
                    label="Van Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="vanname"
                    value={van.vanname}
                    onChange={handleChange}
                    error={Boolean(errors.vanname)}
                    helperText={errors.vanname}
                  />

                  {/* Seats */}
                  <TextField
                    label="Seat Count"
                    fullWidth
                    sx={{ mb: 2 }}
                    name="Seat"
                    value={van.Seat}
                    onChange={handleChange}
                    error={Boolean(errors.Seat)}
                    helperText={errors.Seat}
                  />

                  {/* Type */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.Type)}>
                        <InputLabel shrink>AC Type</InputLabel>
                        <Select
                          name="Type"
                          value={van.Type}
                          label="AC Type"
                          onChange={handleChange}
                          sx={{
                            height: "40px",
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                              height: "50px",
                            },
                          }}
                        >
                          <MenuItem value="AC">AC</MenuItem>
                          <MenuItem value="NoAC">No AC</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.type2)}>
                        <InputLabel shrink>Transmission</InputLabel>
                        <Select
                          name="type2"
                          value={van.type2}
                          label="Transmission"
                          onChange={handleChange}
                          sx={{
                            height: "40px",
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                              height: "50px",
                            },
                          }}
                        >
                          <MenuItem value="Automatic">Automatic</MenuItem>
                          <MenuItem value="Manual">Manual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Images */}
                  <MDTypography variant="subtitle2" sx={{ mb: 1 }}>
                    Van Images
                  </MDTypography>

                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Image URL"
                      size="small"
                      fullWidth
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      error={Boolean(errors.Image)}
                      helperText={errors.Image}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addImage}
                      sx={{ color: "black" }}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Image Preview */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {imagePreview.map((img, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={img}
                          alt="van"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(idx)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ height: 48, color: "#fff" }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Saving..." : "Create Van"}
                  </Button>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
