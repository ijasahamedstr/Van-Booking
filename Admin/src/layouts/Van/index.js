import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Ant Design Image
import { Image } from "antd";

/* ---------- Helper Components ---------- */
const TextCell = ({ text }) => (
  <MDTypography variant="button" fontWeight="medium">
    {text}
  </MDTypography>
);

TextCell.propTypes = {
  text: PropTypes.any,
};

/* ---------- Component ---------- */
function VanSectionView() {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.REACT_APP_API_HOST || "";

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    let mounted = true;

    const fetchVans = async () => {
      try {
        const res = await axios.get(`${apiBase}/Vanaddinfo`);
        if (mounted) {
          setVans(Array.isArray(res.data) ? res.data.reverse() : []);
        }
      } catch (err) {
        console.error("Fetch vans error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVans();
    return () => (mounted = false);
  }, [apiBase]);

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This van will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${apiBase}/Vanaddinfo/${id}`);
      setVans((prev) => prev.filter((v) => v._id !== id));
      Swal.fire("Deleted!", "Van deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Delete failed.", "error");
    }
  };

  /* ---------- TABLE ---------- */
  const columns = [
    { Header: "Van Name", accessor: "vanname", align: "left" },
    { Header: "Seats", accessor: "Seat", align: "center" },
    { Header: "AC Type", accessor: "Type", align: "center" },
    { Header: "Gear", accessor: "type2", align: "center" },
    { Header: "Images", accessor: "Image", align: "center" },
    { Header: "Date", accessor: "date", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = vans.map((van) => ({
    vanname: <TextCell text={van.vanname} />,
    Seat: <TextCell text={van.Seat} />,
    Type: <TextCell text={van.Type} />,
    type2: <TextCell text={van.type2} />,
    Image: (
      <Image.PreviewGroup>
        <MDBox display="flex" gap={1} justifyContent="center">
          {van.Image?.map((img, i) => (
            <Image
              key={i}
              src={img}
              width={70}
              height={50}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
          ))}
        </MDBox>
      </Image.PreviewGroup>
    ),
    date: <TextCell text={van.date || "—"} />,
    action: (
      <MDBox display="flex" gap={1} justifyContent="center">
        <Link to={`/EditVan/${van._id}`}>
          <Button size="small" startIcon={<EditIcon />} sx={{ textTransform: "none" }}>
            Edit
          </Button>
        </Link>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(van._id)}
          sx={{ textTransform: "none" }}
        >
          Delete
        </Button>
      </MDBox>
    ),
  }));

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Van List
                </MDTypography>

                <Link to="/AddVan">
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#000",
                      textTransform: "none",
                    }}
                  >
                    Add Van
                  </Button>
                </Link>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  entriesPerPage={5}
                  pagination
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default VanSectionView;
