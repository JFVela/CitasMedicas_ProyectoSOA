import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const TaskCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "activo",
})(({ theme, activo }) => ({
  margin: theme.spacing(0.5, 0),
  cursor: "pointer",
  backgroundColor: activo ? "#1976d2" : "#bdbdbd",
  color: activo ? "#ffffff" : "#666666",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

export default function TareaHorario({ tarea, onEditar }) {
  return (
    <TaskCard activo={tarea.activo} onClick={() => onEditar(tarea)}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {tarea.horaInicio} - {tarea.horaFin}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={tarea.activo ? "Activo" : "Inactivo"}
              size="small"
              color={tarea.activo ? "success" : "default"}
              variant="outlined"
              sx={{ color: "inherit", borderColor: "currentColor" }}
            />
            <EditIcon fontSize="small" />
          </Box>
        </Box>
      </CardContent>
    </TaskCard>
  );
}
