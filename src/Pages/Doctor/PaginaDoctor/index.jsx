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
import Swal from "sweetalert2";
import LogoutIcon from "@mui/icons-material/Logout";

// ICONOS
import GroupIcon from "@mui/icons-material/Group"; // Pacientes
import AssignmentIcon from "@mui/icons-material/Assignment"; // Historial clínico
import EventIcon from "@mui/icons-material/Event"; // Citas médicas
import { LayoutDashboardIcon } from "lucide-react";

const tabs = [
  {
    label: "Dashboard",
    value: "0",
    icon: <LayoutDashboardIcon />,
    path: "/doctor",
  },
  {
    label: "Lista de Pacientes",
    value: "1",
    icon: <GroupIcon />,
    path: "/doctor/pacientes",
  },
  {
    label: "Citas Médicas",
    value: "2",
    icon: <EventIcon />,
    path: "/doctor/citas-medicas",
  },
  {
    label: "Historial Clínico",
    value: "3",
    icon: <AssignmentIcon />,
    path: "/doctor/historial-clinico",
  },
  {
  label: "Cerrar Sesión",
  value: "4", // Asegúrate de que no colisione con otros tabs
  icon: <LogoutIcon color="error" />,
}
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
  if (newValue === "4") {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuario");
        navigate("/login", { replace: true });
      }
    });
  } else {
    const selectedTab = tabs.find((tab) => tab.value === newValue);
    if (selectedTab?.path) {
      navigate(selectedTab.path);
    }
  }
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
