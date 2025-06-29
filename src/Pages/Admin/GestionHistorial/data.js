// Servicio para manejar las llamadas a la API de historiales médicos
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/hmedicos"

// Función para mapear datos de la API al formato local
const mapearDesdeAPI = (historialAPI) => ({
  id: historialAPI.idHistorial.toString(),
  paciente: `${historialAPI.cita.paciente.nombres} ${historialAPI.cita.paciente.apellidos}`,
  doctor: `${historialAPI.cita.disponibilidad.doctor.nombres} ${historialAPI.cita.disponibilidad.doctor.apellidos}`,
  especialidad: historialAPI.cita.disponibilidad.doctor.especialidad.nombre,
  sede: historialAPI.cita.disponibilidad.sede.nombre,
  fechaCita: historialAPI.cita.fecha,
  fechaRegistro: historialAPI.fechaRegistro,
  diagnostico: historialAPI.diagnostico || "",
  tratamiento: historialAPI.tratamiento || "",
  receta: historialAPI.receta || "",
  // Datos adicionales para mostrar en el modal
  pacienteCompleto: historialAPI.cita.paciente,
  citaCompleta: historialAPI.cita,
})

// Función para mapear datos locales al formato de la API (solo campos editables)
const mapearHaciaAPI = (historialLocal) => ({
  diagnostico: historialLocal.diagnostico,
  tratamiento: historialLocal.tratamiento,
  receta: historialLocal.receta,
})

// Obtener todos los historiales médicos
export const obtenerHistoriales = async () => {
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

// Obtener historial por ID
export const obtenerHistorialPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, { mode: "cors" })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return mapearDesdeAPI(data)
  } catch (error) {
    console.error("Error al obtener historial:", error)
    throw error
  }
}

// Actualizar historial médico (solo diagnóstico, tratamiento y receta)
export const actualizarHistorial = async (id, historial) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(historial)),
      mode: "cors",
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return mapearDesdeAPI(data)
  } catch (error) {
    console.error("Error al actualizar historial:", error)
    throw error
  }
}

// Eliminar historial médico
export const eliminarHistorial = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      mode: "cors",
    })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return true
  } catch (error) {
    console.error("Error al eliminar historial:", error)
    throw error
  }
}
