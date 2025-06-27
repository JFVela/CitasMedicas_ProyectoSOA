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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs from "dayjs"; // Asegúrate de tener instalado `dayjs`
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const TablaHorario = ({
  cabeceras,
  horarios,
  onEditar,
  onAgregar,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  const ordenDias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Ordenar por día y luego hora de inicio
  const horariosOrdenados = [...horarios].sort((a, b) => {
    const diaA = ordenDias.indexOf(a.diaSemana);
    const diaB = ordenDias.indexOf(b.diaSemana);
    if (diaA !== diaB) return diaA - diaB;
    return a.horaInicio.localeCompare(b.horaInicio);
  });

  const horariosPaginados = horariosOrdenados.slice(
    pagina * filasPerPagina,
    pagina * filasPerPagina + filasPerPagina
  );

  // Formato visual HH:mm A (12h)
  const formatearHora12h = (hora) => {
    if (!hora) return "";
    const parsed = dayjs(hora, "HH:mm:ss");
    return parsed.isValid() ? parsed.format("hh:mm A") : hora;
  };

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
          label="Buscar horarios"
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
          Agregar
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="tabla de horarios">
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
            {horariosPaginados.map((horario) => (
              <TableRow hover key={horario.id}>
                {cabeceras.map((cabecera) => (
                  <TableCell key={`${horario.id}-${cabecera.id}`} align="left">
                    {["horaInicio", "horaFin"].includes(cabecera.id)
                      ? formatearHora12h(horario[cabecera.id])
                      : horario[cabecera.id]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton
                      color="warning"
                      onClick={() => onEditar(horario)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {horariosPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron horarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={horarios.length}
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

export default TablaHorario;
