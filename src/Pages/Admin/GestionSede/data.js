// Servicio para manejar las llamadas a la API de sedes
const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091") + "/api/sedes";

// Función para mapear datos de la API al formato local (usado en tabla y formularios)
const mapearDesdeAPI = (sedeAPI) => ({
  id: sedeAPI.idsede.toString(),
  nombre: sedeAPI.nombre,
  direccion: sedeAPI.direccion,
  distrito: sedeAPI.distrito,
  estado: sedeAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Función para mapear datos del front al formato que espera el backend
const mapearHaciaAPI = (sedeLocal) => ({
  nombre: sedeLocal.nombre,
  direccion: sedeLocal.direccion,
  distrito: sedeLocal.distrito,
  estado: sedeLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todas las sedes
export const obtenerSedes = async () => {
  try {
    const response = await fetch(API_BASE_URL, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(mapearDesdeAPI);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica que el backend esté en línea y que permita CORS."
      );
    }
    throw error;
  }
};

// Crear nueva sede
export const crearSede = async (sede) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(sede)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al crear sede:", error);
    throw error;
  }
};

// Actualizar sede
export const actualizarSede = async (id, sede) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapearHaciaAPI(sede)),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return mapearDesdeAPI(data);
  } catch (error) {
    console.error("Error al actualizar sede:", error);
    throw error;
  }
};

// ❌ No hay función para eliminar sede por regla de negocio
