import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { Cancel, People } from "@mui/icons-material";
import { CalendarCheck, CheckCircle } from "lucide-react";

// Tema principal celeste y colores combinados
const theme = createTheme({
  palette: {
    primary: {
      main: "#039be5", // Celeste
    },
    secondary: {
      main: "#ffffff",
    },
    success: {
      main: "#43a047",
    },
    error: {
      main: "#e53935",
    },
    background: {
      default: "#e3f2fd",
      paper: "#ffffff",
    },
    text: {
      primary: "#263238",
      secondary: "#607d8b",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      color: "#039be5",
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const StatCard = styled(Card)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  background: theme.palette.background.paper,
  boxShadow: "0 4px 24px rgba(3,155,229,0.08)",
  borderRadius: 18,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  minWidth: 220,
}));

const StatIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #039be5 60%, #b3e5fc 100%)",
  borderRadius: "50%",
  width: 56,
  height: 56,
}));

const PanelCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 18,
  boxShadow: "0 4px 24px rgba(3,155,229,0.10)",
  background: theme.palette.background.paper,
}));

// Datos simulados
const pacientesSolicitaron = 24;
const citasMedicas = 12;
const pacientesPanel = [
  {
    nombre: "María López",
    estado: "ok",
    motivo: "Control mensual",
  },
  {
    nombre: "Juan Pérez",
    estado: "pendiente",
    motivo: "Dolor de cabeza",
  },
  {
    nombre: "Ana Torres",
    estado: "ok",
    motivo: "Chequeo anual",
  },
  {
    nombre: "Carlos Ruiz",
    estado: "pendiente",
    motivo: "Resultados de análisis",
  },
  {
    nombre: "Lucía Fernández",
    estado: "ok",
    motivo: "Consulta de especialidad",
  },
];

export default function DoctorDashboard() {
  const [panel, setPanel] = useState(pacientesPanel);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: theme.palette.background.default,
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Panel de Doctor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Bienvenido, aquí puedes ver el resumen de tus pacientes y citas.
          </Typography>

          {/* Estadísticas */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <StatCard>
              <StatIcon>
                <People size={32} color="#fff" />
              </StatIcon>
              <Box>
                <Typography variant="h6">Pacientes Solicitados</Typography>
                <Typography variant="h4">{pacientesSolicitaron}</Typography>
              </Box>
            </StatCard>
            <StatCard>
              <StatIcon>
                <CalendarCheck size={32} color="#fff" />
              </StatIcon>
              <Box>
                <Typography variant="h6">Citas Médicas</Typography>
                <Typography variant="h4">{citasMedicas}</Typography>
              </Box>
            </StatCard>
          </Box>

          {/* Panel de Pacientes */}
          <PanelCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Pacientes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {panel.map((p, idx) => (
                  <ListItem key={idx} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            p.estado === "ok"
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        {p.estado === "ok" ? (
                          <CheckCircle size={24} />
                        ) : (
                          <Cancel size={24} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={p.nombre}
                      secondary={p.motivo}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={p.estado === "ok" ? "OK" : "Pendiente"}
                      color={p.estado === "ok" ? "success" : "error"}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </PanelCard>

          {/* Botón de actualización simulado */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 2px 12px rgba(3,155,229,0.15)",
              }}
              onClick={() => {
                // Simula actualización de datos
                setPanel((prev) =>
                  prev.map((p) =>
                    p.estado === "pendiente" ? { ...p, estado: "ok" } : p
                  )
                );
              }}
            >
              Marcar todos como OK
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
