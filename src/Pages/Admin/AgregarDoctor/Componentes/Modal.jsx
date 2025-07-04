import { useState, useEffect } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DialogActions, DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// Contenedor general de campos en 2 columnas
const ContenedorCampos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Cada campo ocupará 48% en pantallas grandes y 100% en móviles
const Campo = styled.div`
  flex: 1 1 48%;
  min-width: 200px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

// Contenedor de cada sección con mejor padding y sombra ligera
const SeccionFormulario = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

// Botones centrados y con mejor espaciado
const AccionesModal = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
`;

// Campo de usuario (ya existente pero lo estilizamos más suave)
const CampoFormulario = styled.div`
  width: 100%;
  margin-bottom: 16px;
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
    } else if (name === "usuario.correo" || name === "usuario.contrasenia") {
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

    // Limpiar error del campo
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
      const campo = c.id;

      // Validaciones específicas
      if (campo === "nombres") {
        if (!valor || valor.trim() === "") {
          nuevosErrores[campo] = "El nombre es requerido";
          esValido = false;
        } else if (!soloLetras.test(valor.trim())) {
          nuevosErrores[campo] = "Solo se permiten letras y espacios";
          esValido = false;
        }
      }
      if (campo === "apellidos") {
        if (!valor || valor.trim() === "") {
          nuevosErrores[campo] = "El apellido es requerido";
          esValido = false;
        } else if (!soloLetras.test(valor.trim())) {
          nuevosErrores[campo] = "Solo se permiten letras y espacios";
          esValido = false;
        }
      }
      if (campo === "dni") {
        if (!valor || valor.trim() === "") {
          nuevosErrores[campo] = "El DNI es requerido";
          esValido = false;
        } else if (!/^\d{8}$/.test(valor)) {
          nuevosErrores[campo] = "El DNI debe tener 8 dígitos numéricos";
          esValido = false;
        }
      }
      if (campo === "celular") {
        if (!valor || valor.trim() === "") {
          nuevosErrores[campo] = "El celular es requerido";
          esValido = false;
        } else if (!/^\d{9}$/.test(valor)) {
          nuevosErrores[campo] = "El celular debe tener 9 dígitos numéricos";
          esValido = false;
        }
      }
      if (campo === "cmp") {
        if (!valor || valor.trim() === "") {
          nuevosErrores[campo] = "El CMP es requerido";
          esValido = false;
        } else if (!soloNumeros.test(valor)) {
          nuevosErrores[campo] = "El CMP debe ser numérico";
          esValido = false;
        }
      }
      if (campo === "especialidad") {
        if (!valor?.id) {
          nuevosErrores[campo] = "Selecciona una especialidad";
          esValido = false;
        }
      }
      // Estado no se valida en modo agregar, solo en editar
      if (campo === "estado" && !esNuevo) {
        if (!valor || (valor !== "Activo" && valor !== "Inactivo")) {
          nuevosErrores[campo] = "Selecciona un estado válido";
          esValido = false;
        }
      }
    });

    // Validar campos de usuario solo para nuevos doctores
    if (esNuevo) {
      const { correo, contrasenia } = formulario.usuario || {};

      if (!correo || correo.trim() === "") {
        nuevosErrores["usuario.correo"] = "El correo es requerido";
        esValido = false;
      } else if (!correoValido.test(correo)) {
        nuevosErrores["usuario.correo"] = "Correo electrónico inválido";
        esValido = false;
      }
      if (!contrasenia || contrasenia.trim() === "") {
        nuevosErrores["usuario.contrasenia"] = "La contraseña es requerida";
        esValido = false;
      } else if (contrasenia.length < 6) {
        nuevosErrores["usuario.contrasenia"] =
          "Contraseña mínima de 6 caracteres";
        esValido = false;
      }
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar(formulario);
    }
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
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {/* SECCIÓN: Datos del Doctor */}
          <SeccionFormulario>
            <Typography variant="h6" color="primary" gutterBottom>
              📋 Datos del Doctor
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {cabeceras.map((cabecera) => (
                <div
                  key={`doctor-field-${cabecera.id}`}
                  style={{
                    flex: "1 1 100%",
                    maxWidth: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      paddingRight: "8px",
                      paddingLeft: "8px",
                    }}
                  >
                    {cabecera.id === "estado" ? (
                      esNuevo ? (
                        <TextField
                          fullWidth
                          label={cabecera.label}
                          value="Activo"
                          variant="outlined"
                          size="small"
                          disabled
                          helperText="El estado será 'Activo' al registrar"
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
                  </div>
                </div>
              ))}
            </div>
          </SeccionFormulario>

          {/* SECCIÓN: Datos de Usuario (solo para nuevos) */}
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

        <DialogActions sx={{ px: 3, pb: 2 }}>
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalFormulario;
