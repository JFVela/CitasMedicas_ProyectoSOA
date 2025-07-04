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

const TablaSedes = ({
  cabeceras,
  sedes,
  onEditar,
  onAgregar,
  busqueda,
  onBusquedaCambio,
  pagina,
  filasPerPagina,
  onCambioPagina,
  onCambioFilasPorPagina,
}) => {
  const sedesPaginadas = sedes.slice(
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
          label="Buscar sedes"
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
        <Table stickyHeader aria-label="tabla de sedes">
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
            {sedesPaginadas.map((sede, index) => (
              <TableRow hover key={sede.id || `sede-${index}`}>
                {cabeceras.map((cabecera) => (
                  <TableCell
                    key={`${sede.id || index}-${cabecera.id}`}
                    align="left"
                  >
                    {sede[cabecera.id] || ""}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton color="warning" onClick={() => onEditar(sede)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {sedesPaginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={cabeceras.length + 1} align="center">
                  No se encontraron sedes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={sedes.length}
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

export default TablaSedes;
