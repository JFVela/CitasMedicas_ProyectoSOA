import { useState, useEffect } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormularioHorario from "./components/FormularioHorario";
import DiaCalendario from "./components/DiaCalendario";
import ModalEdicion from "./components/ModalEdicion";
import {
  obtenerHorarios,
  crearHorario,
  actualizarHorario,
} from "../../../api/services/horarioServices";

// Estilos personalizados
const CalendarioContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#f5f7fa",
  minHeight: "100vh",
}));

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// 🔄 Convertir hora de 12 horas (AM/PM) a 24 horas para la API
export const convertir12A24Horas = (hora12) => {
  const [tiempo, periodo] = hora12.split(" ");
  const [horas, minutos] = tiempo.split(":").map(Number);
  let horas24 = horas;

  if (periodo === "PM" && horas !== 12) horas24 += 12;
  if (periodo === "AM" && horas === 12) horas24 = 0;

  return `${horas24.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:00`;
};

// 🔄 Convertir hora de 24 horas a 12 horas (AM/PM) para el frontend
export const convertir24A12Horas = (hora24) => {
  const [horas, minutos] = hora24.split(":").map(Number);
  let horas12 = horas;
  let periodo = "AM";

  if (horas === 0) {
    horas12 = 12;
  } else if (horas === 12) {
    periodo = "PM";
  } else if (horas > 12) {
    horas12 = horas - 12;
    periodo = "PM";
  }

  return `${horas12}:${minutos.toString().padStart(2, "0")} ${periodo}`;
};

// Convertir hora a minutos para comparación
export const convertirA24Horas = (hora12) => {
  const [tiempo, periodo] = hora12.split(" ");
  const [horas, minutos] = tiempo.split(":").map(Number);
  let horas24 = horas;
  if (periodo === "PM" && horas !== 12) horas24 += 12;
  if (periodo === "AM" && horas === 12) horas24 = 0;
  return horas24 * 60 + minutos;
};

// 🔄 Mapear datos de la API al formato del frontend
const mapearHorarioDesdeAPI = (horarioAPI) => ({
  id: horarioAPI.id,
  dia: horarioAPI.diaSemana,
  horaInicio: convertir24A12Horas(horarioAPI.horaInicio),
  horaFin: convertir24A12Horas(horarioAPI.horaFin),
  activo: horarioAPI.estado === "Activo",
});

// 🔄 Mapear datos del frontend al formato de la API
const mapearHorarioHaciaAPI = (horarioLocal) => ({
  diaSemana: horarioLocal.dia,
  horaInicio: convertir12A24Horas(horarioLocal.horaInicio),
  horaFin: convertir12A24Horas(horarioLocal.horaFin),
  estado: horarioLocal.activo ? "Activo" : "Inactivo", // ✅ Esto se convertirá a 1/0 en el service
});

export default function CalendarioHorarios() {
  const [tareas, setTareas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [alerta, setAlerta] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "success",
  });
  const [cargando, setCargando] = useState(true);

  // 🔄 Cargar horarios desde la API al iniciar
  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      setCargando(true);
      const horariosAPI = await obtenerHorarios();
      const horariosMapeados = horariosAPI.map(mapearHorarioDesdeAPI);
      setTareas(horariosMapeados);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      setAlerta({
        mostrar: true,
        mensaje:
          "Error al cargar los horarios: " +
          (error.message || "Error desconocido"),
        tipo: "error",
      });
      setTimeout(() => setAlerta({ mostrar: false }), 4000);
    } finally {
      setCargando(false);
    }
  };

  const verificarHorarioExistente = (
    dia,
    horaInicio,
    horaFin,
    idExcluir = null
  ) => {
    return tareas.some((tarea) => {
      if (idExcluir && tarea.id === idExcluir) return false;
      return (
        tarea.dia === dia &&
        tarea.horaInicio === horaInicio &&
        tarea.horaFin === horaFin
      );
    });
  };

  const guardarTarea = async (formulario) => {
    try {
      // Verificar si ya existe un horario igual
      if (
        verificarHorarioExistente(
          formulario.dia,
          formulario.horaInicio,
          formulario.horaFin
        )
      ) {
        setAlerta({
          mostrar: true,
          mensaje: `Ya existe un horario de ${formulario.horaInicio} a ${formulario.horaFin} el día ${formulario.dia}`,
          tipo: "error",
        });
        setTimeout(() => setAlerta({ mostrar: false }), 4000);
        return false;
      }

      // 🔄 Crear horario en la API - ✅ Estado por defecto: Activo (1)
      const horarioParaAPI = mapearHorarioHaciaAPI({
        ...formulario,
        activo: true, // ✅ Por defecto activo
      });

      console.log("Enviando a API:", horarioParaAPI); // Para debugging

      const nuevoHorarioAPI = await crearHorario(horarioParaAPI);
      const nuevoHorario = mapearHorarioDesdeAPI(nuevoHorarioAPI);

      setTareas([...tareas, nuevoHorario]);
      setAlerta({
        mostrar: true,
        mensaje: "Horario agregado exitosamente",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mostrar: false }), 3000);
      return true;
    } catch (error) {
      console.error("Error al crear horario:", error);
      setAlerta({
        mostrar: true,
        mensaje:
          "Error al crear el horario: " +
          (error.message || "Error desconocido"),
        tipo: "error",
      });
      setTimeout(() => setAlerta({ mostrar: false }), 4000);
      return false;
    }
  };

  const abrirModalEdicion = (tarea) => {
    console.log("Abriendo modal para editar:", tarea); // Para debugging
    setTareaEditando({ ...tarea }); // ✅ Crear copia para evitar mutación
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTareaEditando(null); // ✅ Limpiar tarea editando
  };

  const guardarEdicion = async (tareaActualizada) => {
    try {
      // Verificar si ya existe un horario igual (excluyendo el actual)
      if (
        verificarHorarioExistente(
          tareaActualizada.dia,
          tareaActualizada.horaInicio,
          tareaActualizada.horaFin,
          tareaActualizada.id
        )
      ) {
        setAlerta({
          mostrar: true,
          mensaje: `Ya existe un horario de ${tareaActualizada.horaInicio} a ${tareaActualizada.horaFin} el día ${tareaActualizada.dia}`,
          tipo: "error",
        });
        setTimeout(() => setAlerta({ mostrar: false }), 4000);
        return false;
      }

      // 🔄 Actualizar horario en la API
      const horarioParaAPI = mapearHorarioHaciaAPI(tareaActualizada);
      console.log("Actualizando en API:", horarioParaAPI); // Para debugging

      const horarioActualizadoAPI = await actualizarHorario(
        tareaActualizada.id,
        horarioParaAPI
      );
      const horarioActualizado = mapearHorarioDesdeAPI(horarioActualizadoAPI);

      setTareas(
        tareas.map((t) =>
          t.id === tareaActualizada.id ? horarioActualizado : t
        )
      );
      cerrarModal(); // ✅ Usar función que limpia todo
      setAlerta({
        mostrar: true,
        mensaje: "Horario actualizado exitosamente",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mostrar: false }), 3000);
      return true;
    } catch (error) {
      console.error("Error al actualizar horario:", error);
      setAlerta({
        mostrar: true,
        mensaje:
          "Error al actualizar el horario: " +
          (error.message || "Error desconocido"),
        tipo: "error",
      });
      setTimeout(() => setAlerta({ mostrar: false }), 4000);
      return false;
    }
  };

  const obtenerTareasPorDia = (dia) => {
    return tareas
      .filter((tarea) => tarea.dia === dia)
      .sort(
        (a, b) =>
          convertirA24Horas(a.horaInicio) - convertirA24Horas(b.horaInicio)
      );
  };

  if (cargando) {
    return (
      <CalendarioContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Cargando horarios...
          </Typography>
        </Box>
      </CalendarioContainer>
    );
  }

  return (
    <CalendarioContainer>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        color="primary"
        fontWeight="bold"
      >
        📅 Gestión de Horarios Semanales
      </Typography>

      {/* Alerta */}
      {alerta.mostrar && (
        <Alert
          severity={alerta.tipo}
          sx={{ mb: 3 }}
          onClose={() => setAlerta({ mostrar: false })}
        >
          {alerta.mensaje}
        </Alert>
      )}

      {/* Formulario */}
      <FormularioHorario onGuardar={guardarTarea} diasSemana={diasSemana} />

      {/* Calendario Semanal */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {diasSemana.map((dia) => (
          <DiaCalendario
            key={dia}
            dia={dia}
            tareas={obtenerTareasPorDia(dia)}
            onEditarTarea={abrirModalEdicion}
          />
        ))}
      </Box>

      {/* Modal de Edición */}
      <ModalEdicion
        abierto={modalAbierto}
        tarea={tareaEditando}
        onCerrar={cerrarModal}
        onGuardar={guardarEdicion}
      />
    </CalendarioContainer>
  );
}
