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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const TablaCitas = ({
  cabeceras,
  citas,
  onEditar,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha + "T00:00:00");
    return fechaObj.toLocaleDateString("es-ES");
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "warning";
      case "Confirmada":
        return "info";
      case "Finalizada":
        return "success";
      case "Rechazada":
        return "error";
      case "Inactivo":
        return "default";
      default:
        return "default";
    }
  };

  const renderizarCelda = (cita, cabecera) => {
    switch (cabecera.id) {
      case "fecha":
        return formatearFecha(cita.fecha);
      case "estado":
        return (
          <Chip
            label={cita.estado}
            color={obtenerColorEstado(cita.estado)}
            size="small"
            variant="outlined"
          />
        );
      case "motivo":
        return cita.motivo?.length > 50
          ? `${cita.motivo.substring(0, 50)}...`
          : cita.motivo;
      default:
        return cita[cabecera.id] || "";
    }
  };

  const citasPaginadas = citas.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          label="Buscar citas médicas"
          variant="outlined"
          size="small"
          value={busqueda}
          onChange={onBusquedaCambio}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Solo edición de estado y motivo
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de citas médicas">
          <TableHead>
            <TableRow>
              {cabeceras.map((cabecera) => (
                <TableCell key={cabecera.id} align="left">
                  {cabecera.label}
                </TableCell>
              ))}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citasPaginadas.map((cita) => (
              <TableRow hover key={cita.id}>
                {cabeceras.map((cabecera) => (
                  <TableCell key={`${cita.id}-${cabecera.id}`} align="left">
                    {renderizarCelda(cita, cabecera)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar estado y motivo">
                    <IconButton color="primary" onClick={() => onEditar(cita)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {citasPaginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron citas médicas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
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
