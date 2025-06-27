import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const ModalFormulario = ({
  abierto,
  onCerrar,
  onGuardar,
  registro,
  cabeceras,
  especialidades,
  guardando = false,
}) => {
  const [formulario, setFormulario] = useState({});
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (registro) {
      setFormulario({ ...registro });
    } else {
      const inicial = {};
      cabeceras.forEach((c) => {
        if (c.id === "estado") {
          inicial[c.id] = "Activo";
        } else if (c.id === "especialidad") {
          inicial[c.id] = { id: "", nombre: "" };
        } else {
          inicial[c.id] = "";
        }
      });
      setFormulario(inicial);
    }
    setErrores({});
  }, [registro, cabeceras, abierto]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    if (name === "especialidad") {
      const esp = especialidades.find((esp) => esp.id === value);
      setFormulario({
        ...formulario,
        especialidad: { id: value, nombre: esp?.especialidad || "" },
      });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }

    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    let valido = true;

    cabeceras.forEach((c) => {
      const valor = formulario[c.id];
      const campo = c.id;

      if (campo === "especialidad" && !valor?.id) {
        nuevosErrores[campo] = "Selecciona una especialidad";
        valido = false;
      } else if (!valor || (typeof valor === "string" && valor.trim() === "")) {
        nuevosErrores[campo] = `El campo ${c.label} es obligatorio`;
        valido = false;
      }

      if (campo === "dni" && valor && !/^\d{8}$/.test(valor)) {
        nuevosErrores[campo] = "El DNI debe tener 8 dígitos";
        valido = false;
      }

      if (campo === "correo" && valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        nuevosErrores[campo] = "Correo inválido";
        valido = false;
      }

      if (campo === "celular" && valor && !/^\d{9}$/.test(valor)) {
        nuevosErrores[campo] = "El celular debe tener 9 dígitos";
        valido = false;
      }

      if (campo === "cmp" && valor && !/^\d+$/.test(valor)) {
        nuevosErrores[campo] = "El CMP debe ser numérico";
        valido = false;
      }
    });

    setErrores(nuevosErrores);
    return valido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validar()) {
      onGuardar(formulario);
    }
  };

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{registro ? "Editar Doctor" : "Agregar Doctor"}</DialogTitle>
      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            {cabeceras.map((c) => (
              <article key={c.id} style={{ flex: "1 1 45%", minWidth: "250px" }}>
                {c.id === "estado" ? (
                  <TextField
                    select
                    fullWidth
                    name={c.id}
                    label={c.label}
                    value={formulario[c.id] || ""}
                    onChange={manejarCambio}
                    disabled={guardando}
                    error={!!errores[c.id]}
                    helperText={errores[c.id]}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </TextField>
                ) : c.id === "especialidad" ? (
                  <TextField
                    select
                    fullWidth
                    name={c.id}
                    label={c.label}
                    value={formulario.especialidad?.id || ""}
                    onChange={manejarCambio}
                    disabled={guardando}
                    error={!!errores[c.id]}
                    helperText={errores[c.id]}
                  >
                    {especialidades.map((esp) => (
                      <MenuItem key={esp.id} value={esp.id}>
                        {esp.especialidad}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    name={c.id}
                    label={c.label}
                    value={formulario[c.id] || ""}
                    onChange={manejarCambio}
                    disabled={guardando}
                    error={!!errores[c.id]}
                    helperText={errores[c.id]}
                  />
                )}
              </article>
            ))}
          </section>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCerrar} color="secondary" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={guardando}
            startIcon={guardando && <CircularProgress size={20} />}
          >
            {guardando ? "Guardando..." : registro ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalFormulario;
