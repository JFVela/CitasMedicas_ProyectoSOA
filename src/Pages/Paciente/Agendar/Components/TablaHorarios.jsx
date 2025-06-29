import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  styled,
} from "@mui/material";
import { CheckCircle, Schedule, Person, LocationOn } from "@mui/icons-material";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  maxHeight: 400,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: "white",
}));

const StyledButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: 20,
  backgroundColor: selected ? theme.palette.primary.main : "transparent",
  color: selected ? "white" : theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
}));

export default function TablaDisponibilidades({
  disponibilidades,
  disponibilidadSeleccionada,
  onSeleccionar,
  cargando,
}) {
  const formatearFecha = (fecha) => {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearHora = (hora) => {
    return hora?.slice(0, 5) || "";
  };

  if (cargando) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando disponibilidades...
        </Typography>
      </Box>
    );
  }

  if (disponibilidades.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No hay disponibilidades para la sede y especialidad seleccionadas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Por favor, seleccione otra combinación
        </Typography>
      </Box>
    );
  }

  return (
    <StyledTableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Box display="flex" alignItems="center">
                <Person sx={{ mr: 1 }} />
                Doctor
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1 }} />
                Sede
              </Box>
            </StyledTableCell>
            <StyledTableCell>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ mr: 1 }} />
                Horario
              </Box>
            </StyledTableCell>
            <StyledTableCell align="center">Acción</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {disponibilidades.map((disponibilidad) => {
            const isSelected =
              disponibilidadSeleccionada?.idDispon === disponibilidad.idDispon;
            return (
              <TableRow
                key={disponibilidad.idDispon}
                sx={{
                  backgroundColor: isSelected
                    ? "rgba(211, 47, 47, 0.1)"
                    : "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(211, 47, 47, 0.05)",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {`${disponibilidad.doctor.nombres} ${disponibilidad.doctor.apellidos}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CMP: {disponibilidad.doctor.cmp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {disponibilidad.sede.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {disponibilidad.sede.distrito}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={disponibilidad.horario.diaSemana}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, display: "block", width: "fit-content" }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {`${formatearHora(
                      disponibilidad.horario.horaInicio
                    )} - ${formatearHora(disponibilidad.horario.horaFin)}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatearFecha(disponibilidad.fechaInicio)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <StyledButton
                    selected={isSelected}
                    onClick={() => onSeleccionar(disponibilidad)}
                    startIcon={isSelected ? <CheckCircle /> : null}
                  >
                    {isSelected ? "Seleccionado" : "Seleccionar"}
                  </StyledButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
