// Servicio para manejar las llamadas a la API de especialidades
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/especialidades"

// Función para mapear datos de la API al formato local
const mapearDesdeAPI = (especialidadAPI) => ({
  id: especialidadAPI.idespecialidad.toString(),
  especialidad: especialidadAPI.nombre,
  descripcion: especialidadAPI.descripcion,
  estado: especialidadAPI.estado === 1 ? "Activo" : "Inactivo",
})

// Obtener todas las especialidades
export const obtenerEspecialidades = async () => {
  try {
    const response = await fetch(API_BASE_URL, { mode: "cors" })
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data.map(mapearDesdeAPI)
  } catch (error) {
    // Si es un error de red (TypeError en fetch) mostramos detalle
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor. " + "Verifica que el backend esté en línea y que permita CORS.",
      )
    }
    throw error
  }
}
