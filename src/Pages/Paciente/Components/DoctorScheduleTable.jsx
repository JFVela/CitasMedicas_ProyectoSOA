import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Radio,
  Typography,
  Box,
} from "@mui/material";

export function DoctorScheduleTable({
  schedules,
  selectedScheduleId,
  onScheduleSelect,
}) {
  if (schedules.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No hay horarios disponibles para la sede y especialidad seleccionadas.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seleccionar</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Hora de Atención</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow
              key={schedule.id}
              sx={{
                backgroundColor:
                  selectedScheduleId === schedule.id
                    ? "action.selected"
                    : "inherit",
                "&:hover": {
                  backgroundColor:
                    schedule.estado === "libre" ? "action.hover" : "inherit",
                },
                cursor: schedule.estado === "libre" ? "pointer" : "default",
              }}
              onClick={() => {
                if (schedule.estado === "libre") {
                  onScheduleSelect(schedule.id, schedule.doctor, schedule.hora);
                }
              }}
            >
              <TableCell>
                <Radio
                  checked={selectedScheduleId === schedule.id}
                  disabled={schedule.estado === "reservado"}
                  onChange={() =>
                    onScheduleSelect(
                      schedule.id,
                      schedule.doctor,
                      schedule.hora
                    )
                  }
                />
              </TableCell>
              <TableCell>{schedule.doctor}</TableCell>
              <TableCell>{schedule.hora}</TableCell>
              <TableCell>
                <Chip
                  label={schedule.estado === "libre" ? "Libre" : "Reservado"}
                  color={schedule.estado === "libre" ? "success" : "error"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
