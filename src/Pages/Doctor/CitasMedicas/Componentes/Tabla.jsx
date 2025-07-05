import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import EventIcon from "@mui/icons-material/Event";
import { Tooltip } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { IconButton } from "@mui/material";

const TablaCitas = ({
  cabeceras,
  citas,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
  onCrearHistorial, // ✅ Nueva prop
}) => {
  const citasPaginadas = citas.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  // ✅ Función para formatear la fecha y hora de la cita
  const formatearFechaCita = (fechaCita) => {
    if (!fechaCita) return "N/A";
    const fecha = new Date(fechaCita);
    return fecha.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Función para mapear el estado de la cita a texto y color
  const obtenerEstadoCita = (estadoCita) => {
    const estados = {
      1: { texto: "Programada", color: "primary" },
      2: { texto: "En Proceso", color: "warning" },
      3: { texto: "Completada", color: "success" },
      4: { texto: "Cancelada", color: "error" },
      0: { texto: "Pendiente", color: "default" },
    };
    return estados[estadoCita] || { texto: "Desconocido", color: "default" };
  };

  // ✅ Función para obtener el valor de la celda con formato
  const obtenerValorCelda = (cita, cabecera) => {
    const valor = cita[cabecera.id];

    switch (cabecera.id) {
      case "idCita": // ✅ Nueva columna ID
        return valor || "N/A";
      case "fechaCita":
        return formatearFechaCita(valor);
      case "estadoCita":
        const estado = obtenerEstadoCita(valor);
        return (
          <Chip
            label={estado.texto}
            color={estado.color}
            size="small"
            variant="outlined"
          />
        );
      case "motivoConsulta":
        return (
          <Tooltip title={valor || "Sin motivo especificado"} arrow>
            <span
              style={{
                display: "block",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {valor || "Sin motivo"}
            </span>
          </Tooltip>
        );
      case "nombres":
      case "apellidos":
        return valor || "N/A";
      case "dni":
        return valor || "Sin DNI";
      case "celular":
        return valor || "Sin teléfono";
      default:
        return valor || "N/A";
    }
  };

  // ✅ Contar citas por estado para estadísticas
  const contarPorEstado = () => {
    const contadores = {};
    citas.forEach((cita) => {
      const estado = obtenerEstadoCita(cita.estadoCita);
      contadores[estado.texto] = (contadores[estado.texto] || 0) + 1;
    });
    return contadores;
  };

  const estadisticas = contarPorEstado();

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      {/* ✅ Header con búsqueda y estadísticas */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Buscar citas"
          variant="outlined"
          size="small"
          value={busqueda}
          onChange={onBusquedaCambio}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* ✅ Chips con estadísticas de citas */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<EventIcon />}
            label={`${citas.length} cita${citas.length !== 1 ? "s" : ""}`}
            color="primary"
            variant="outlined"
          />
          {Object.entries(estadisticas).map(([estado, cantidad]) => (
            <Chip
              key={estado}
              label={`${estado}: ${cantidad}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de citas del doctor">
          <TableHead>
            <TableRow>
              {cabeceras.map((cabecera) => (
                <TableCell key={`header-${cabecera.id}`} align="left">
                  {cabecera.label}
                </TableCell>
              ))}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasPaginadas.map((cita) => (
              <TableRow hover key={`cita-${cita.id}`}>
                {cabeceras.map((cabecera) => (
                  <TableCell
                    key={`cell-${cita.id}-${cabecera.id}`}
                    align="left"
                  >
                    {obtenerValorCelda(cita, cabecera)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Crear Historial Médico" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => onCrearHistorial(cita)}
                      disabled={cita.estadoCita === 4} // Deshabilitado si está cancelada
                    >
                      <MedicalServicesIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {citasPaginadas.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={cabeceras.length + 1}
                  align="center"
                  sx={{ py: 4 }}
                >
                  {busqueda
                    ? "No se encontraron citas que coincidan con la búsqueda"
                    : "Este doctor no tiene citas programadas"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 30]}
        component="div"
        count={citas.length}
        rowsPerPage={filasPerPagina}
        page={pagina}
        onPageChange={onCambioPagina}
        onRowsPerPageChange={onCambioFilasPorPagina}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </Paper>
  );
};

export default TablaCitas;
