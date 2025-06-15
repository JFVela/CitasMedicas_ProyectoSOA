"use client"
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

const TablaPacientes = ({
  cabeceras,
  pacientes,
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
  const confirmarEliminacion = (paciente) => {
    Swal.fire({
      title: "¿Estás seguro?",
      html: `¿Desea eliminar a <strong>${paciente.nombre} ${paciente.apellido}</strong> de la lista de pacientes?`,
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
              Swal.showValidationMessage("Debe escribir ELIMINAR para confirmar")
            }
            return palabra
          },
        }).then((result) => {
          if (result.isConfirmed) {
            onEliminar(paciente.id)
            Swal.fire("¡Eliminado!", "El paciente ha sido eliminado correctamente.", "success")
          }
        })
      }
    })
  }

  // Calcular pacientes para la página actual
  const pacientesPaginados = pacientes.slice(pagina * filasPerPagina, pagina * filasPerPagina + filasPerPagina)

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Buscar pacientes"
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
          Agregar Paciente
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de pacientes">
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
            {pacientesPaginados.map((paciente) => (
              <TableRow hover key={paciente.id}>
                {cabeceras.map((cabecera) => (
                  <TableCell key={`${paciente.id}-${cabecera.id}`} align="left">
                    {paciente[cabecera.id]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => onEditar(paciente)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => confirmarEliminacion(paciente)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {pacientesPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron pacientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={pacientes.length}
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

export default TablaPacientes
