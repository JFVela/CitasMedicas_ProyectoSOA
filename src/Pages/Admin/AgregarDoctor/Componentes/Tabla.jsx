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
  Button,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";

const TablaDoctores = ({
  cabeceras,
  doctores,
  onEditar,
  onEliminar,
  onAgregar,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  // ✅ Función para mostrar correctamente cada valor en la celda:
  const obtenerValorCelda = (doctor, campo) => {
    if (campo === "especialidad") {
      return doctor.especialidad?.nombre || "Sin Especialidad";
    }
    if (campo === "estado") {
      return doctor.estado === 1 ? "Activo" : "Inactivo";
    }
    if (campo === "correo") {
      return doctor.usuario?.correo || "No asignado";
    }
    return doctor[campo] ?? "";
  };

  const confirmarEliminacion = (doctor) => {
    Swal.fire({
      title: `¿Eliminar al doctor ${doctor.nombres} ${doctor.apellidos}?`,
      html: `Escriba <strong>ELIMINAR</strong> para confirmar`,
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      preConfirm: (input) => {
        if (input !== "ELIMINAR") {
          Swal.showValidationMessage("Debe escribir ELIMINAR para continuar");
        }
      },
    }).then((res) => {
      if (res.isConfirmed && res.value === "ELIMINAR") {
        onEliminar(doctor.id);
        Swal.fire("Eliminado", "El doctor ha sido eliminado", "success");
      }
    });
  };

  const paginados = doctores.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  const cabecerasFiltradas = cabeceras.filter((c) => c.id !== "correo");

  return (
    <Paper sx={{ width: "100%", mb: 4 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <TextField
          size="small"
          value={busqueda}
          onChange={onBusquedaCambio}
          label="Buscar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAgregar}>
          Agregar
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {cabecerasFiltradas.map((c) => (
                <TableCell key={c.id}>{c.label}</TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginados.map((doctor) => (
              <TableRow key={doctor.id} hover>
                {cabecerasFiltradas.map((c) => (
                  <TableCell key={c.id}>
                    {obtenerValorCelda(doctor, c.id)}
                  </TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => onEditar(doctor)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      onClick={() => confirmarEliminacion(doctor)}
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
                <TableCell
                  colSpan={cabecerasFiltradas.length + 1}
                  align="center"
                >
                  No hay resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={doctores.length}
        rowsPerPage={filasPerPagina}
        page={pagina}
        onPageChange={onCambioPagina}
        onRowsPerPageChange={onCambioFilasPorPagina}
        labelRowsPerPage="Filas por página"
      />
    </Paper>
  );
};

export default TablaDoctores;
