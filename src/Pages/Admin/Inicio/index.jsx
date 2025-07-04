import {
  Box,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  styled,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  EventNote as EventNoteIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

// Tema profesional para administrador
const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#1a237e", // Azul marino profundo
      light: "#534bae",
      dark: "#000051",
    },
    secondary: {
      main: "#37474f", // Gris azulado
      light: "#62727b",
      dark: "#102027",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#263238",
      secondary: "#546e7a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 600,
    },
  },
});

// Componentes estilizados
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
  borderRadius: 16,
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "50%",
    transform: "translate(50%, -50%)",
  },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  flex: "1 1 280px",
  minWidth: "280px",
  padding: theme.spacing(3),
  borderRadius: 16,
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: "1px solid rgba(26, 35, 126, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(26, 35, 126, 0.15)",
    "& .stat-icon": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #1a237e, #3949ab)",
  },
}));

const ActivitySection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
  },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  flex: 1,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(26, 35, 126, 0.08)",
  border: "1px solid rgba(26, 35, 126, 0.05)",
}));

const QuickActionButton = styled(IconButton)(({ theme }) => ({
  width: 56,
  height: 56,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  margin: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.1)",
  },
  transition: "all 0.3s ease",
}));

const stats = [
  {
    label: "Citas Hoy",
    value: 24,
    change: "+12%",
    icon: <EventNoteIcon fontSize="large" />,
    color: "#1976d2",
    bgColor: "rgba(25, 118, 210, 0.1)",
  },
  {
    label: "Pacientes Activos",
    value: 156,
    change: "+8%",
    icon: <PeopleIcon fontSize="large" />,
    color: "#2e7d32",
    bgColor: "rgba(46, 125, 50, 0.1)",
  },
  {
    label: "Historiales",
    value: 89,
    change: "+15%",
    icon: <AssignmentIcon fontSize="large" />,
    color: "#ed6c02",
    bgColor: "rgba(237, 108, 2, 0.1)",
  },
  {
    label: "Disponibilidades",
    value: 32,
    change: "+5%",
    icon: <AccessTimeIcon fontSize="large" />,
    color: "#d32f2f",
    bgColor: "rgba(211, 47, 47, 0.1)",
  },
];

const recentActivities = [
  {
    action: "Nueva cita registrada",
    patient: "Juan Pérez",
    time: "Hace 5 min",
    type: "cita",
  },
  {
    action: "Historial actualizado",
    patient: "María García",
    time: "Hace 12 min",
    type: "historial",
  },
  {
    action: "Paciente registrado",
    patient: "Carlos López",
    time: "Hace 25 min",
    type: "paciente",
  },
  {
    action: "Disponibilidad creada",
    patient: "Dr. Rodríguez",
    time: "Hace 1 hora",
    type: "disponibilidad",
  },
];

const upcomingAppointments = [
  {
    patient: "Ana Martínez",
    doctor: "Dr. Silva",
    time: "09:00",
    specialty: "Cardiología",
  },
  {
    patient: "Pedro Ruiz",
    doctor: "Dra. Torres",
    time: "10:30",
    specialty: "Dermatología",
  },
  {
    patient: "Laura Vega",
    doctor: "Dr. Morales",
    time: "11:15",
    specialty: "Pediatría",
  },
  {
    patient: "Miguel Santos",
    doctor: "Dra. Herrera",
    time: "14:00",
    specialty: "Neurología",
  },
];

export default function AdminDashboard() {
  const getActivityIcon = (type) => {
    switch (type) {
      case "cita":
        return <EventNoteIcon color="primary" />;
      case "historial":
        return <AssignmentIcon color="warning" />;
      case "paciente":
        return <PersonAddIcon color="success" />;
      case "disponibilidad":
        return <ScheduleIcon color="error" />;
      default:
        return <AssessmentIcon />;
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <DashboardContainer>
        {/* Header Section */}
        <HeaderSection>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
            zIndex={1}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Panel de Administración
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Bienvenido de vuelta, Admin
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton sx={{ color: "white" }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <SettingsIcon />
              </IconButton>
              <Avatar
                sx={{ width: 48, height: 48, bgcolor: "rgba(255,255,255,0.2)" }}
              >
                <Typography variant="h6" fontWeight="bold">
                  A
                </Typography>
              </Avatar>
            </Box>
          </Box>
        </HeaderSection>

        {/* Stats Cards */}
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard key={stat.label} elevation={0}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Avatar
                  className="stat-icon"
                  sx={{
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    width: 64,
                    height: 64,
                    transition: "all 0.3s ease",
                  }}
                >
                  {stat.icon}
                </Avatar>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                {stat.value}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {stat.label}
                </Typography>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    bgcolor: "rgba(46, 125, 50, 0.1)",
                    color: "#2e7d32",
                    fontWeight: "bold",
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{
                  mt: 2,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: stat.color,
                    borderRadius: 3,
                  },
                }}
              />
            </StatCard>
          ))}
        </StatsContainer>

        {/* Activity Section */}
        <ActivitySection>
          {/* Recent Activities */}
          <ActivityCard>
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Typography variant="h6" fontWeight="bold">
                  Actividad Reciente
                </Typography>
                <Chip
                  label="En vivo"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                {recentActivities.map((activity, index) => (
                  <Box key={index}>
                    <Box display="flex" alignItems="center" gap={2} py={1}>
                      {getActivityIcon(activity.type)}
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight={500}>
                          {activity.action}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.patient} • {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    {index < recentActivities.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ActivityCard>

          {/* Upcoming Appointments */}
          <ActivityCard>
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Typography variant="h6" fontWeight="bold">
                  Próximas Citas
                </Typography>
                <Chip
                  label="Hoy"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                {upcomingAppointments.map((appointment, index) => (
                  <Box key={index}>
                    <Box display="flex" alignItems="center" gap={2} py={1}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                      >
                        <HospitalIcon />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight={500}>
                          {appointment.patient}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.doctor} • {appointment.specialty}
                        </Typography>
                      </Box>
                      <Chip
                        label={appointment.time}
                        size="small"
                        sx={{
                          bgcolor: "rgba(26, 35, 126, 0.1)",
                          color: "primary.main",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    {index < upcomingAppointments.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ActivityCard>
        </ActivitySection>

        {/* Quick Actions */}
        <Box mt={4}>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            color="text.primary"
          >
            Acciones Rápidas
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <QuickActionButton title="Nueva Cita">
              <EventNoteIcon />
            </QuickActionButton>
            <QuickActionButton title="Registrar Paciente">
              <PersonAddIcon />
            </QuickActionButton>
            <QuickActionButton title="Ver Historiales">
              <AssignmentIcon />
            </QuickActionButton>
            <QuickActionButton title="Gestionar Horarios">
              <ScheduleIcon />
            </QuickActionButton>
            <QuickActionButton title="Reportes">
              <AssessmentIcon />
            </QuickActionButton>
            <QuickActionButton title="Configuración">
              <SettingsIcon />
            </QuickActionButton>
          </Box>
        </Box>
      </DashboardContainer>
    </ThemeProvider>
  );
}
