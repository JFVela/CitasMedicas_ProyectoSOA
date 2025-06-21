import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TablePagination from "@mui/material/TablePagination"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import InputAdornment from "@mui/material/InputAdornment"
import Swal from "sweetalert2"

const Tabla = ({
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
  const confirmarEliminacion = (registro) => {
    Swal.fire({
      title: "¿Estás seguro?",
      html: `¿Desea eliminar al doctor <strong>${registro.nombre} ${registro.apellido}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onEliminar(registro.id)
        Swal.fire("¡Eliminado!", "El doctor ha sido eliminado correctamente.", "success")
      }
    })
  }

  const registrosPaginados = doctores.slice(pagina * filasPerPagina, pagina * filasPerPagina + filasPerPagina)

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
          label="Buscar doctores"
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
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAgregar}>
          Agregar Doctor
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de doctores">
          <TableHead>
            <TableRow>
              {cabeceras.map((cabecera) => (
                <TableCell key={cabecera.id}>{cabecera.label}</TableCell>
              ))}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrosPaginados.map((registro) => (
              <TableRow hover key={registro.id}>
                {cabeceras.map((cabecera) => (
                  <TableCell key={`${registro.id}-${cabecera.id}`}>
                    {cabecera.id === "estado"
                      ? registro[cabecera.id] === 1
                        ? "Activo"
                        : "Inactivo"
                      : registro[cabecera.id]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton color="warning" onClick={() => onEditar(registro)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => confirmarEliminacion(registro)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {registrosPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron doctores
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={doctores.length}
        rowsPerPage={filasPerPagina}
        page={pagina}
        onPageChange={onCambioPagina}
        onRowsPerPageChange={onCambioFilasPorPagina}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}

export default Tabla
