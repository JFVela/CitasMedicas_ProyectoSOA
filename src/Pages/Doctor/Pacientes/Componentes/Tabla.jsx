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
import PersonIcon from "@mui/icons-material/Person";

const TablaPacientes = ({
  cabeceras,
  pacientes,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  const pacientesPaginados = pacientes.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  // ✅ Función para formatear la fecha de nacimiento
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // ✅ Función para obtener el valor de la celda con formato
  const obtenerValorCelda = (paciente, cabecera) => {
    const valor = paciente[cabecera.id];

    switch (cabecera.id) {
      case "fechaNacimiento":
        return formatearFecha(valor);
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      {/* ✅ Header simplificado - solo búsqueda */}
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
          label="Buscar pacientes"
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

        {/* ✅ Chip con contador de pacientes */}
        <Chip
          icon={<PersonIcon />}
          label={`${pacientes.length} paciente${
            pacientes.length !== 1 ? "s" : ""
          }`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de pacientes del doctor">
          <TableHead>
            <TableRow>
              {cabeceras.map((cabecera) => (
                <TableCell key={`header-${cabecera.id}`} align="left">
                  {cabecera.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientesPaginados.map((paciente) => (
              <TableRow hover key={`paciente-${paciente.id}`}>
                {cabeceras.map((cabecera) => (
                  <TableCell
                    key={`cell-${paciente.id}-${cabecera.id}`}
                    align="left"
                  >
                    {obtenerValorCelda(paciente, cabecera)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {pacientesPaginados.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={cabeceras.length}
                  align="center"
                  sx={{ py: 4 }}
                >
                  {busqueda
                    ? "No se encontraron pacientes que coincidan con la búsqueda"
                    : "Este doctor no tiene pacientes asignados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 30]}
        component="div"
        count={pacientes.length}
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

export default TablaPacientes;
