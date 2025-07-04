import API from "../AxiosConfig";
import { API_ROUTES } from "../apiRoutes";

// Mapear datos desde la API al formato local
const mapearDesdeAPI = (especialidadAPI) => ({
  id: especialidadAPI.idespecialidad?.toString(),
  especialidad: especialidadAPI.nombre,
  descripcion: especialidadAPI.descripcion,
  estado: especialidadAPI.estado === 1 ? "Activo" : "Inactivo",
});

// Mapear datos locales al formato de la API
const mapearHaciaAPI = (especialidadLocal) => ({
  nombre: especialidadLocal.especialidad,
  descripcion: especialidadLocal.descripcion,
  estado: especialidadLocal.estado === "Activo" ? 1 : 0,
});

// Obtener todas las especialidades
export const obtenerEspecialidades = async () => {
  const response = await API.get(API_ROUTES.especialidades);
  return response.data.map(mapearDesdeAPI);
};

// Crear nueva especialidad
export const crearEspecialidad = async (especialidad) => {
  const response = await API.post(API_ROUTES.especialidades, mapearHaciaAPI(especialidad));
  return mapearDesdeAPI(response.data);
};

// Actualizar especialidad
export const actualizarEspecialidad = async (id, especialidad) => {
  const response = await API.put(`${API_ROUTES.especialidades}/${id}`, mapearHaciaAPI(especialidad));
  return mapearDesdeAPI(response.data);
};

// Eliminar especialidad
export const eliminarEspecialidad = async (id) => {
  await API.delete(`${API_ROUTES.especialidades}/${id}`);
  return true;
};
