import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import BotonAccion from "./BotonAccion";

export default function TablaHorarios({
  horarios,
  horarioSeleccionado,
  onSeleccionar,
}) {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {horarios.map((fila) => (
            <TableRow
              key={fila.id}
              selected={horarioSeleccionado === fila.hora}
            >
              <TableCell>{fila.doctor}</TableCell>
              <TableCell>{fila.fecha}</TableCell>
              <TableCell>{fila.hora}</TableCell>
              <TableCell>
                <BotonAccion
                  variant={
                    horarioSeleccionado === fila.hora ? "contained" : "outlined"
                  }
                  onClick={() => onSeleccionar(fila)}
                  size="small"
                >
                  {horarioSeleccionado === fila.hora
                    ? "Seleccionado"
                    : "Seleccionar"}
                </BotonAccion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
