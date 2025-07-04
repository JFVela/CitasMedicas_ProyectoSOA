import API from "../AxiosConfig";
import { API_ROUTES } from "../apiRoutes";

// Mapear datos desde la API al frontend
const mapearDesdeAPI = (sedeAPI) => ({
  id: sedeAPI.id_sede?.toString(),
  nombre: sedeAPI.nombre,
  direccion: sedeAPI.direccion,
  distrito: sedeAPI.distrito,
  estado: sedeAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Mapear datos desde el frontend a la API
const mapearHaciaAPI = (sedeLocal) => ({
  nombre: sedeLocal.nombre,
  direccion: sedeLocal.direccion,
  distrito: sedeLocal.distrito,
  estado: sedeLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todas las sedes
export const obtenerSedes = async () => {
  const response = await API.get(API_ROUTES.sedes);
  return response.data.map(mapearDesdeAPI);
};

// Crear nueva sede
export const crearSede = async (sede) => {
  const response = await API.post(API_ROUTES.sedes, mapearHaciaAPI(sede));
  return mapearDesdeAPI(response.data);
};

// Actualizar sede existente
export const actualizarSede = async (id, sede) => {
  const response = await API.put(`${API_ROUTES.sedes}/${id}`, mapearHaciaAPI(sede));
  return mapearDesdeAPI(response.data);
};

// ❌ No se elimina sede por regla de negocio
