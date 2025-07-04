import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {
  DialogActions,
  DialogContent,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

// Styled Components
const SeccionFormulario = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ContenedorCampos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Campo = styled.div`
  flex: 1 1 48%;
  min-width: 200px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const CampoFormulario = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const AccionesModal = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
`;

const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const soloNumeros = /^\d+$/;
const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const esNuevo = !registro;

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
      inicial.usuario = { correo: "", contrasenia: "", rol: "3" };
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
    } else if (name.startsWith("usuario.")) {
      const campo = name.split(".")[1];
      setFormulario({
        ...formulario,
        usuario: {
          ...formulario.usuario,
          [campo]: value,
        },
      });
    } else {
      setFormulario({
        ...formulario,
        [name]: value,
      });
    }

    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    cabeceras.forEach((c) => {
      const valor = formulario[c.id];

      if (c.id === "nombres" && (!valor || !soloLetras.test(valor.trim()))) {
        nuevosErrores[c.id] = !valor ? "El nombre es requerido" : "Solo letras";
        esValido = false;
      }

      if (c.id === "apellidos" && (!valor || !soloLetras.test(valor.trim()))) {
        nuevosErrores[c.id] = !valor
          ? "El apellido es requerido"
          : "Solo letras";
        esValido = false;
      }

      if (c.id === "dni" && (!valor || !/^\d{8}$/.test(valor))) {
        nuevosErrores[c.id] = "DNI inválido (8 dígitos)";
        esValido = false;
      }

      if (c.id === "celular" && (!valor || !/^\d{9}$/.test(valor))) {
        nuevosErrores[c.id] = "Celular inválido (9 dígitos)";
        esValido = false;
      }

      if (c.id === "cmp" && (!valor || !soloNumeros.test(valor))) {
        nuevosErrores[c.id] = "CMP inválido (solo números)";
        esValido = false;
      }

      if (c.id === "especialidad" && !valor?.id) {
        nuevosErrores[c.id] = "Especialidad requerida";
        esValido = false;
      }

      if (
        c.id === "estado" &&
        !esNuevo &&
        (!valor || (valor !== "Activo" && valor !== "Inactivo"))
      ) {
        nuevosErrores[c.id] = "Estado inválido";
        esValido = false;
      }
    });

    if (esNuevo) {
      const { correo, contrasenia } = formulario.usuario || {};
      if (!correo || !correoValido.test(correo)) {
        nuevosErrores["usuario.correo"] = "Correo inválido o requerido";
        esValido = false;
      }
      if (!contrasenia || contrasenia.length < 6) {
        nuevosErrores["usuario.contrasenia"] = "Contraseña mínima 6 caracteres";
        esValido = false;
      }
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) onGuardar(formulario);
  };

  return (
    <Dialog
      open={abierto}
      onClose={!guardando ? onCerrar : undefined}
      fullWidth
      maxWidth="md"
      disableEnforceFocus
    >
      <DialogTitle>
        {registro ? "Editar Doctor" : "Registrar Nuevo Doctor"}
      </DialogTitle>

      <form onSubmit={manejarEnvio}>
        <DialogContent dividers>
          <SeccionFormulario>
            <Typography variant="h6" color="primary" gutterBottom>
              📋 Datos del Doctor
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <ContenedorCampos>
              {cabeceras.map((cabecera) => (
                <Campo key={`campo-${cabecera.id}`}>
                  {cabecera.id === "estado" ? (
                    esNuevo ? (
                      <TextField
                        fullWidth
                        label={cabecera.label}
                        value="Activo"
                        variant="outlined"
                        size="small"
                        disabled
                        helperText="Estado será 'Activo'"
                      />
                    ) : (
                      <TextField
                        select
                        fullWidth
                        label={cabecera.label}
                        name={cabecera.id}
                        value={formulario[cabecera.id] || ""}
                        onChange={manejarCambio}
                        error={!!errores[cabecera.id]}
                        helperText={errores[cabecera.id] || ""}
                        variant="outlined"
                        size="small"
                        disabled={guardando}
                      >
                        <MenuItem value="Activo">Activo</MenuItem>
                        <MenuItem value="Inactivo">Inactivo</MenuItem>
                      </TextField>
                    )
                  ) : cabecera.id === "especialidad" ? (
                    <TextField
                      select
                      fullWidth
                      label={cabecera.label}
                      name={cabecera.id}
                      value={formulario.especialidad?.id || ""}
                      onChange={manejarCambio}
                      error={!!errores[cabecera.id]}
                      helperText={errores[cabecera.id] || ""}
                      variant="outlined"
                      size="small"
                      disabled={guardando}
                    >
                      {especialidades.map((esp) => (
                        <MenuItem key={`esp-${esp.id}`} value={esp.id}>
                          {esp.especialidad}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      label={cabecera.label}
                      name={cabecera.id}
                      value={formulario[cabecera.id] || ""}
                      onChange={manejarCambio}
                      error={!!errores[cabecera.id]}
                      helperText={errores[cabecera.id] || ""}
                      variant="outlined"
                      size="small"
                      disabled={guardando}
                    />
                  )}
                </Campo>
              ))}
            </ContenedorCampos>
          </SeccionFormulario>

          {esNuevo && (
            <SeccionFormulario>
              <Typography variant="h6" color="secondary" gutterBottom>
                👤 Datos de Usuario
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <CampoFormulario>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="usuario.correo"
                  type="email"
                  value={formulario.usuario?.correo || ""}
                  onChange={manejarCambio}
                  error={!!errores["usuario.correo"]}
                  helperText={errores["usuario.correo"] || ""}
                  variant="outlined"
                  size="small"
                  disabled={guardando}
                />
              </CampoFormulario>

              <CampoFormulario>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="usuario.contrasenia"
                  type="password"
                  value={formulario.usuario?.contrasenia || ""}
                  onChange={manejarCambio}
                  error={!!errores["usuario.contrasenia"]}
                  helperText={errores["usuario.contrasenia"] || ""}
                  variant="outlined"
                  size="small"
                  disabled={guardando}
                />
              </CampoFormulario>
            </SeccionFormulario>
          )}
        </DialogContent>

        <AccionesModal>
          <Button onClick={onCerrar} color="secondary" disabled={guardando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={guardando}
            startIcon={guardando ? <CircularProgress size={20} /> : null}
          >
            {guardando ? "Guardando..." : registro ? "Actualizar" : "Registrar"}
          </Button>
        </AccionesModal>
      </form>
    </Dialog>
  );
};

export default ModalFormulario;
