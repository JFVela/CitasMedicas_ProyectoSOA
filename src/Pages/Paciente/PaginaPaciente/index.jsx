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
import Navegador from "../../../Components/NavTabs";

// ICONOS
import HomeIcon from "@mui/icons-material/Home";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LoginIcon from "@mui/icons-material/Login";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";

const tabsPublicas = [
  {
    label: "Inicio",
    value: "1",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    label: "Agendar Cita",
    value: "2",
    icon: <EventAvailableIcon />,
    path: "/agendar",
  },
  {
    label: "Iniciar Sesión",
    value: "3",
    icon: <LoginIcon />,
    path: "/login",
  },
];

const tabsPrivadas = [
  {
    label: "Inicio",
    value: "1",
    icon: <HomeIcon />,
    path: "/paciente",
  },
  {
    label: "Agendar Cita",
    value: "2",
    icon: <EventAvailableIcon />,
    path: "/paciente/agendar",
  },
  {
    label: "Mis Citas",
    value: "4",
    icon: <DescriptionIcon />,
    path: "/paciente/detalle",
  },
  {
    label: "Cerrar Sesión",
    value: "5",
    icon: <LogoutIcon />,
    path: "/paciente/logout",
  },
];

function PaginaBasePaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mounted, setMounted] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [ultimaActividad, setUltimaActividad] = useState(Date.now());

  const tabs = usuario ? tabsPrivadas : tabsPublicas;

  useEffect(() => {
    setMounted(true);

    const intervalo = setInterval(() => {
      if (usuario && Date.now() - ultimaActividad > 30 * 60 * 1000) {
        // 30 minutos de inactividad
        setUsuario(null);
        navigate("/paciente");
        alert("Sesión cerrada por inactividad");
      }
    }, 60 * 1000); // Verificar cada minuto

    const actualizarActividad = () => setUltimaActividad(Date.now());
    window.addEventListener("click", actualizarActividad);
    window.addEventListener("keypress", actualizarActividad);

    return () => {
      clearInterval(intervalo);
      window.removeEventListener("click", actualizarActividad);
      window.removeEventListener("keypress", actualizarActividad);
    };
  }, [usuario, ultimaActividad, navigate]);

  const getTabValue = () =>
    tabs.find((tab) => tab.path === location.pathname)?.value || false;

  const handleChange = (event, newValue) => {
    const selectedTab = tabs.find((tab) => tab.value === newValue);

    if (selectedTab.path === "/paciente/logout") {
      setUsuario(null);
      navigate("/paciente");
    } else {
      navigate(selectedTab.path);
    }
  };

  // Simular autenticación simple
  useEffect(() => {
    if (location.pathname === "/paciente/login") {
      const credenciales = prompt(
        "Ingrese usuario (juan) y contraseña (123), separados por coma:"
      );
      if (credenciales) {
        const [user, pass] = credenciales.split(",").map((x) => x.trim());
        if (user === "juan" && pass === "123") {
          setUsuario({ nombre: "Juan" });
          setUltimaActividad(Date.now());
          navigate("/paciente/detalle");
        } else {
          alert("Credenciales incorrectas");
          navigate("/paciente");
        }
      } else {
        navigate("/paciente");
      }
    }
  }, [location.pathname, navigate]);

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
            <Outlet context={{ usuario }} />
          </Paper>
        </Container>
      </TabContext>
    </Box>
  );
}

export default PaginaBasePaciente;
