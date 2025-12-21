import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EditVan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_HOST || "";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [van, setVan] = useState({
    vanname: "",
    Seat: "",
    Type: "",
    type2: "",
    Image: [],
  });

  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState({});

  /* ---------- IMAGE VALIDATION ---------- */
  const isImageUrl = (url) => {
    try {
      const u = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(u.pathname);
    } catch {
      return false;
    }
  };

  const imagePreview = useMemo(() => van.Image.filter((img) => isImageUrl(img)), [van.Image]);

  /* ---------- FETCH VAN (REUSABLE) ---------- */
  const fetchVan = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${apiBase}/Vanaddinfo/${id}`);
      const data = res?.data?.data ?? res?.data;

      if (!data) {
        Swal.fire("Error", "Van not found", "error");
        navigate(-1);
        return;
      }

      setVan({
        vanname: data.vanname || "",
        Seat: data.Seat || "",
        Type: data.Type || "",
        type2: data.type2 || "",
        Image: Array.isArray(data.Image) ? data.Image : [],
      });
    } catch (err) {
      Swal.fire("Error", "Failed to fetch van", "error");
      navigate(-1);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchVan();
  }, [id]);

  /* ---------- HANDLERS ---------- */
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

    if (van.Image.includes(url)) return;

    setVan((prev) => ({ ...prev, Image: [...prev.Image, url] }));
    setImageInput("");
  };

  /* ✅ DELETE IMAGE (FIXED – BY URL) */
  const removeImage = (imgUrl) => {
    setVan((prev) => ({
      ...prev,
      Image: prev.Image.filter((img) => img !== imgUrl),
    }));
  };

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const e = {};
    if (!van.vanname.trim()) e.vanname = "Van name required";
    if (!van.Seat) e.Seat = "Seat count required";
    if (isNaN(Number(van.Seat))) e.Seat = "Seat must be numeric";
    if (!van.Type) e.Type = "Select AC type";
    if (!van.type2) e.type2 = "Select transmission";
    if (van.Image.length === 0) e.Image = "Add at least one image";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- UPDATE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await axios.put(`${apiBase}/Vanaddinfo/${id}`, {
        ...van,
        Seat: Number(van.Seat),
      });

      Swal.close();
      await Swal.fire("Updated", "Van updated successfully", "success");

      // 🔥 IMPORTANT FIX – RE-FETCH AFTER UPDATE
      await fetchVan();
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} display="flex" justifyContent="center">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  /* ---------- UI ---------- */
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
                  Edit Van
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} pb={3}>
                <form onSubmit={handleSubmit}>
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

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={Boolean(errors.Type)}>
                        <InputLabel shrink>AC Type</InputLabel>
                        <Select
                          name="Type"
                          value={van.Type}
                          onChange={handleChange}
                          sx={{ height: 50 }}
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
                          onChange={handleChange}
                          sx={{ height: 50 }}
                        >
                          <MenuItem value="Automatic">Automatic</MenuItem>
                          <MenuItem value="Manual">Manual</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

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

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {imagePreview.map((img) => (
                      <Box
                        key={img}
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
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(img)}
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
                    {loading ? "Updating..." : "Update Van"}
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
