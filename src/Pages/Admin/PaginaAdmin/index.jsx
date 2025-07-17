import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  AppBar,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { TabContext } from "@mui/lab";
import { useState, useEffect } from "react";
import Navegador from "../../../Components/NavTabs/index.jsx";
import Swal from "sweetalert2";

// ICONOS
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; // Doctores
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Especialidades
import GroupIcon from "@mui/icons-material/Group"; // Pacientes
import AssignmentIcon from "@mui/icons-material/Assignment"; // Historial clínico
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
    label: "Sedes",
    value: "6",
    icon: <DomainAddIcon />,
    path: "/admin/gestionSede", // Ruta temporal
  },
  {
    label: "Horarios",
    value: "7",
    icon: <AccessTimeFilledIcon />,
    path: "/admin/gestionHorario", // Ruta temporal
  },
  {
    label: "Disponibilidad",
    value: "8",
    icon: <CheckCircleIcon />,
    path: "/admin/gestionDisponibilidad", // Ruta temporal
  },
  {
    label: "Citas",
    value: "9",
    icon: <AssignmentIcon />,
    path: "/admin/gestionCitas", // Ruta temporal
  },
  {
    label: "Cerrar Sesion",
    value: "10",
    icon: <LogoutIcon color="error" />,
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

  //limpiar el usuario y redirigir al login:
  // const handleLogout = () => {
  //   localStorage.removeItem("usuario");
  //   navigate("/login"), { replace: true }; //Esto evita que el usuario regrese con el botón de "atrás" a una vista protegida.
  // };
  const handleChange = (event, newValue) => {
  if (newValue === "10") {
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
    if (selectedTab && selectedTab.path) {
      navigate(selectedTab.path);
    }
  }
};

  const getTabValue = () =>
    tabs.find((tab) => tab.path === location.pathname)?.value || false;

  // const handleChange = (event, newValue) => {
  //   const selectedTab = tabs.find((tab) => tab.value === newValue);
  //   if (selectedTab) navigate(selectedTab.path);
  // };

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
          {/* //Dentro del AppBar, después de */}
          {/* <Tooltip title="Cerrar sesión">
            <IconButton onClick={handleLogout} sx={{ ml: "auto" }}>
              <LogoutIcon color="error" />
            </IconButton>
          </Tooltip> */}

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
