import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  AppBar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TabContext } from "@mui/lab";
import { useState, useEffect } from "react";
import Navegador from "../../../Components/NavTabs/index.jsx";

// ICONOS
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; // Doctores
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Especialidades
import GroupIcon from "@mui/icons-material/Group"; // Pacientes
import AssignmentIcon from "@mui/icons-material/Assignment"; // Historial clínico

const tabs = [
  {
    label: "Dashboard",
    value: "1",
    icon: <SpaceDashboardIcon />,
    path: "/admin",
  },
  {
    label: "Doctores",
    value: "2",
    icon: <LocalHospitalIcon />,
    path: "/admin/gestionDoctor", // Ruta temporal
  },
  {
    label: "Especialidades",
    value: "3",
    icon: <MedicalServicesIcon />,
    path: "/admin/gestionEspecialidad", // Ruta temporal
  },
  {
    label: "Pacientes",
    value: "4",
    icon: <GroupIcon />,
    path: "/admin/gestionPaciente", // Ruta temporal
  },
  {
    label: "Historial Clínico",
    value: "5",
    icon: <AssignmentIcon />,
    path: "*", // Ruta temporal
  },
];

function PaginaBase() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTabValue = () =>
    tabs.find((tab) => tab.path === location.pathname)?.value || false;

  const handleChange = (event, newValue) => {
    const selectedTab = tabs.find((tab) => tab.value === newValue);
    if (selectedTab) navigate(selectedTab.path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5f7fa, #e4e8f0)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <TabContext value={getTabValue()}>
        <AppBar
          position="sticky"
          color="default"
          elevation={3}
          sx={{
            background: "rgba(255, 255, 255, 0.9)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <Navegador
            tabs={tabs}
            currentValue={getTabValue()}
            onChange={handleChange}
            isMobile={isMobile}
          />
        </AppBar>

        <Container
          maxWidth="lg"
          sx={{
            mt: 4,
            mb: 4,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <Outlet />
          </Paper>
        </Container>
      </TabContext>
    </Box>
  );
}

export default PaginaBase;
