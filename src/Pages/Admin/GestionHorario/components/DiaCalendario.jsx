import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TareaHorario from "./TareaHorario";

const DiaContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: "400px",
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(1),
  border: "2px solid #e3f2fd",
  position: "relative",
}));

export default function DiaCalendario({ dia, tareas, onEditarTarea }) {
  return (
    <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
      <DiaContainer>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          color="primary"
          fontWeight="bold"
          textAlign="center"
        >
          {dia}
        </Typography>

        <Box sx={{ maxHeight: "350px", overflowY: "auto" }}>
          {tareas.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 4 }}
            >
              Sin horarios programados
            </Typography>
          ) : (
            tareas.map((tarea) => (
              <TareaHorario
                key={tarea.id}
                tarea={tarea}
                onEditar={onEditarTarea}
              />
            ))
          )}
        </Box>
      </DiaContainer>
    </Box>
  );
}
