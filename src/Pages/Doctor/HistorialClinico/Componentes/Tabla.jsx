import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";

const TablaHistorial = ({
  cabeceras,
  historiales,
  onEditar,
  onEliminar,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  const confirmarEliminacion = (historial) => {
    Swal.fire({
      title: `¿Eliminar historial médico?`,
      html: `¿Desea eliminar el historial del paciente <strong>${historial.paciente}</strong>?<br/>Escriba <strong>ELIMINAR</strong> para confirmar`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      preConfirm: (input) => {
        if (input !== "ELIMINAR") {
          Swal.showValidationMessage("Debe escribir ELIMINAR para continuar");
        }
      },
    }).then((res) => {
      if (res.isConfirmed && res.value === "ELIMINAR") {
        onEliminar(historial.id);
        Swal.fire(
          "Eliminado",
          "El historial médico ha sido eliminado",
          "success"
        );
      }
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-ES");
  };

  const formatearFechaHora = (fechaHora) => {
    if (!fechaHora) return "";
    const fechaObj = new Date(fechaHora);
    return fechaObj.toLocaleString("es-ES");
  };

  const truncarTexto = (texto, maxLength = 50) => {
    if (!texto) return "";
    return texto.length > maxLength
      ? `${texto.substring(0, maxLength)}...`
      : texto;
  };

  const renderizarCelda = (historial, cabecera) => {
    switch (cabecera.id) {
      case "fechaCita":
        return formatearFecha(historial.fechaCita);
      case "fechaRegistro":
        return formatearFechaHora(historial.fechaRegistro);
      case "diagnostico":
      case "tratamiento":
      case "receta":
        return truncarTexto(historial[cabecera.id]);
      default:
        return historial[cabecera.id] || "";
    }
  };

  const paginados = historiales.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  return (
    <Paper sx={{ width: "100%", mb: 4 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          value={busqueda}
          onChange={onBusquedaCambio}
          label="Buscar historiales médicos"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Solo edición de diagnóstico, tratamiento y receta
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {cabeceras.map((c) => (
                <TableCell key={c.id}>{c.label}</TableCell>
              ))}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginados.map((historial) => (
              <TableRow key={historial.id} hover>
                {cabeceras.map((c) => (
                  <TableCell key={c.id}>
                    {renderizarCelda(historial, c)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar diagnóstico, tratamiento y receta">
                    <IconButton
                      onClick={() => onEditar(historial)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar historial">
                    <IconButton
                      onClick={() => confirmarEliminacion(historial)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No hay historiales médicos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={historiales.length}
        rowsPerPage={filasPerPagina}
        page={pagina}
        onPageChange={onCambioPagina}
        onRowsPerPageChange={onCambioFilasPorPagina}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </Paper>
  );
};

export default TablaHistorial;
