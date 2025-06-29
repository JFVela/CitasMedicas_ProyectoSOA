import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Swal from "sweetalert2";

const TablaDisponibilidad = ({
  cabeceras,
  registros,
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
  const confirmarEliminacion = (disponibilidad) => {
    Swal.fire({
      title: "¿Estás seguro?",
      html: `¿Desea eliminar la disponibilidad del Dr. <strong>${disponibilidad.doctor.nombre}</strong> en <strong>${disponibilidad.sede.nombre}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirmar eliminación",
          html: "Ingrese la siguiente palabra: <strong>ELIMINAR</strong>",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: (palabra) => {
            if (palabra !== "ELIMINAR") {
              Swal.showValidationMessage(
                "Debe escribir ELIMINAR para confirmar"
              );
            }
            return palabra;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            onEliminar(disponibilidad.id);
            Swal.fire(
              "¡Eliminado!",
              "La disponibilidad ha sido eliminada correctamente.",
              "success"
            );
          }
        });
      }
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha + "T00:00:00");
    return fechaObj.toLocaleDateString("es-ES");
  };

  const renderizarCelda = (disponibilidad, cabecera) => {
    switch (cabecera.id) {
      case "doctor":
        return disponibilidad.doctor.nombre;
      case "sede":
        return disponibilidad.sede.nombre;
      case "horario":
        return disponibilidad.horario.nombre;
      case "fechaInicio":
      case "fechaFin":
        return formatearFecha(disponibilidad[cabecera.id]);
      case "estado":
        return (
          <Chip
            label={disponibilidad.estado}
            color={disponibilidad.estado === "Activo" ? "success" : "default"}
            size="small"
          />
        );
      default:
        return disponibilidad[cabecera.id] || "";
    }
  };

  const registrosPaginados = registros.slice(
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
          label="Buscar disponibilidades"
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAgregar}
        >
          Agregar Disponibilidad
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de disponibilidades">
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
            {registrosPaginados.map((disponibilidad) => (
              <TableRow hover key={disponibilidad.id}>
                {cabeceras.map((cabecera) => (
                  <TableCell
                    key={`${disponibilidad.id}-${cabecera.id}`}
                    align="left"
                  >
                    {renderizarCelda(disponibilidad, cabecera)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      color="warning"
                      onClick={() => onEditar(disponibilidad)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => confirmarEliminacion(disponibilidad)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {registrosPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron disponibilidades
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={registros.length}
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

export default TablaDisponibilidad;
