"use client"

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
  Avatar,
} from "@mui/material"
import { AccessTime, Person } from "@mui/icons-material"

export function TablaHorariosDoctores({ horarios, horarioSeleccionadoId, onSeleccionarHorario }) {
  if (horarios.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          bgcolor: "grey.50",
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <Person sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay horarios disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona una sede y especialidad para ver los horarios disponibles
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.main" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Seleccionar</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person />
                Doctor
              </Box>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTime />
                Hora de Atención
              </Box>
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {horarios.map((horario, index) => (
            <TableRow
              key={horario.id}
              sx={{
                backgroundColor:
                  horarioSeleccionadoId === horario.id ? "primary.light" : index % 2 === 0 ? "grey.50" : "white",
                "&:hover": {
                  backgroundColor: horario.estado === "libre" ? "primary.light" : "inherit",
                  transform: horario.estado === "libre" ? "scale(1.01)" : "none",
                  transition: "all 0.2s ease-in-out",
                },
                cursor: horario.estado === "libre" ? "pointer" : "default",
                opacity: horario.estado === "reservado" ? 0.6 : 1,
              }}
              onClick={() => {
                if (horario.estado === "libre") {
                  onSeleccionarHorario(horario.id, horario.doctor, horario.hora)
                }
              }}
            >
              <TableCell>
                <Radio
                  checked={horarioSeleccionadoId === horario.id}
                  disabled={horario.estado === "reservado"}
                  onChange={() => onSeleccionarHorario(horario.id, horario.doctor, horario.hora)}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    {horario.doctor.split(" ")[1]?.[0] || "D"}
                  </Avatar>
                  <Typography variant="body1" fontWeight="medium">
                    {horario.doctor}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">
                  {horario.hora}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={horario.estado === "libre" ? "Disponible" : "Reservado"}
                  color={horario.estado === "libre" ? "success" : "error"}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    minWidth: 100,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
