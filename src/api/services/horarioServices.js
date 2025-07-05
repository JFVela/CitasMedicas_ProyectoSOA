import API from "../AxiosConfig"
import { API_ROUTES } from "../apiRoutes"

// 🔄 Mapear datos desde la API al formato del frontend
const mapearDesdeAPI = (horarioAPI) => ({
  id: horarioAPI.idHorario?.toString(),
  diaSemana: horarioAPI.diaSemana,
  horaInicio: horarioAPI.horaInicio, // ejemplo: "08:00:00"
  horaFin: horarioAPI.horaFin, // ejemplo: "17:00:00"
  estado: horarioAPI.estado === 1 ? "Activo" : "Inactivo",
})

// 🔄 Mapear datos desde el frontend hacia la API
const mapearHaciaAPI = (horarioLocal) => ({
  diaSemana: horarioLocal.diaSemana,
  horaInicio: horarioLocal.horaInicio,
  horaFin: horarioLocal.horaFin,
  estado: horarioLocal.estado === "Activo" ? 1 : 0, // ✅ Corregido: usar números 1/0
})

/*
📋 Obtener todos los horarios
👉 GET /api/horarios
📌 Uso:
const horarios = await obtenerHorarios();
*/
export const obtenerHorarios = async () => {
  const response = await API.get(API_ROUTES.horarios)
  return response.data.map(mapearDesdeAPI)
}

/*
➕ Crear un nuevo horario
👉 POST /api/horarios
📌 Uso:
const nuevo = await crearHorario({ diaSemana: "Lunes", horaInicio: "08:00:00", horaFin: "17:00:00", estado: 1 });
*/
export const crearHorario = async (horario) => {
  const response = await API.post(API_ROUTES.horarios, mapearHaciaAPI(horario))
  return mapearDesdeAPI(response.data)
}

/*
✏️ Actualizar un horario existente
👉 PUT /api/horarios/{id}
📌 Uso:
await actualizarHorario(3, { diaSemana: "Martes", horaInicio: "09:00:00", horaFin: "18:00:00", estado: 1 });
*/
export const actualizarHorario = async (id, horario) => {
  const response = await API.put(`${API_ROUTES.horarios}/${id}`, mapearHaciaAPI(horario))
  return mapearDesdeAPI(response.data)
}

// ❌ Por ahora no hay eliminar, pero se puede agregar si lo decides
