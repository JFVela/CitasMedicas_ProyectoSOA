const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/citas"

// Mapea datos desde la API al formato que usará el frontend
const mapearDesdeAPI = (citaAPI) => ({
  id: citaAPI.idCita.toString(),
  paciente: `${citaAPI.paciente.nombres} ${citaAPI.paciente.apellidos}`,
  especialidad: citaAPI.disponibilidad.doctor.especialidad.nombre,
  doctor: `${citaAPI.disponibilidad.doctor.nombres} ${citaAPI.disponibilidad.doctor.apellidos}`,
  sede: citaAPI.disponibilidad.sede.nombre,
  fecha: citaAPI.fecha,
  horario: `${citaAPI.disponibilidad.horario.diaSemana} ${citaAPI.disponibilidad.horario.horaInicio.slice(
    0,
    5,
  )} - ${citaAPI.disponibilidad.horario.horaFin.slice(0, 5)}`,
  motivo: citaAPI.motivoCons,
  estado:
    citaAPI.estado === 0
      ? "Inactivo"
      : citaAPI.estado === 1
        ? "Pendiente"
        : citaAPI.estado === 2
          ? "Confirmada"
          : citaAPI.estado === 3
            ? "Rechazada"
            : "Finalizada",
})

// Mapea solo campos editables hacia la API
const mapearHaciaAPI = (citaLocal) => ({
  motivoCons: citaLocal.motivo,
  estado:
    citaLocal.estado === "Inactivo"
      ? 0
      : citaLocal.estado === "Pendiente"
        ? 1
        : citaLocal.estado === "Confirmada"
          ? 2
          : citaLocal.estado === "Rechazada"
            ? 3
            : 4, // Finalizada por defecto
})

// Obtener todas las citas
export const obtenerCitas = async () => {
  try {
    const response = await fetch(API_BASE_URL, { mode: "cors" })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data.map(mapearDesdeAPI)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté en línea y permita CORS.")
    }
    throw error
  }
}

// Editar motivo y/o estado de la cita
export const actualizarCita = async (id, cita) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapearHaciaAPI(cita)),
      mode: "cors",
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return mapearDesdeAPI(data)
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    throw error
  }
}
