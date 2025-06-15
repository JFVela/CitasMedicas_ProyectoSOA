import { Paper, Typography, Divider, Box, Stack } from "@mui/material";

export default function ResumenCita({ datos }) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        📄 Resumen de la Cita Médica
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1}>
        <Item label="DNI" value={datos.dni} />
        <Item label="Correo" value={datos.correo} />
        <Item label="Teléfono" value={datos.telefono} />
        <Item label="Sede" value={datos.sede} />
        <Item label="Especialidad" value={datos.especialidad} />
        <Item label="Doctor" value={datos.doctor} />
        <Item label="Fecha" value={datos.fecha} />
        <Item label="Horario" value={datos.horario} />
        <Item label="Método de pago" value={datos.metodoPago} />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="text.secondary">
        Descripción de síntomas:
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {datos.sintomas || "No registrado."}
      </Typography>
    </Paper>
  );
}

function Item({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" fontWeight="bold">
        {label}:
      </Typography>
      <Typography variant="body2">{value || "No registrado"}</Typography>
    </Box>
  );
}
