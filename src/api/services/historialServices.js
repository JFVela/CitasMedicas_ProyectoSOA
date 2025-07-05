import API from "../AxiosConfig";

import { API_ROUTES } from "../apiRoutes";

/* 
🔄 Mapear datos desde la API al formato local (HMedicoResponseDTO)
*/
const mapearDesdeAPI = (historialAPI) => ({
    id: historialAPI.idHistorial?.toString() || "",
    diagnostico: historialAPI.diagnostico || "",
    tratamiento: historialAPI.tratamiento || "",
    receta: historialAPI.receta || "",
    fechaRegistro: historialAPI.fechaRegistro || "",
    cita: {
        id: historialAPI.cita?.idCita?.toString() || "",
        fecha: historialAPI.cita?.fechaCita || "",
        motivoConsulta: historialAPI.cita?.motivoConsulta || "",
    },
});

/* 
🔄 Mapear datos locales al formato de la API (para crear o actualizar)
*/
const mapearHaciaAPI = (historialLocal) => ({
    diagnostico: historialLocal.diagnostico,
    tratamiento: historialLocal.tratamiento,
    receta: historialLocal.receta,
    cita: { id: parseInt(historialLocal.cita.id, 10) },
});

/* 
✅ Obtener todos los historiales médicos
👉 GET /api/hmedicos
📌 Uso:
const historiales = await obtenerHistoriales();
*/
export const obtenerHistoriales = async () => {
    const response = await API.get(API_ROUTES.hmedicos);
    return response.data.map(mapearDesdeAPI);
};

/* 
✅ Obtener un historial médico por ID
👉 GET /api/hmedicos/{id}
📌 Uso:
const historial = await obtenerHistorialPorId(5);
*/
export const obtenerHistorialPorId = async (id) => {
    const response = await API.get(`${API_ROUTES.hmedicos}/${id}`);
    return mapearDesdeAPI(response.data);
};

/* 
✅ Crear un nuevo historial médico (directo, no desde cita)
👉 POST /api/hmedicos
📌 Uso:
const nuevo = await crearHistorial({ diagnostico, tratamiento, receta, cita: { id: 1 } });
*/
export const crearHistorial = async (historial) => {
    const response = await API.post(API_ROUTES.hmedicos, mapearHaciaAPI(historial));
    return mapearDesdeAPI(response.data);
};

/* 
✅ Actualizar un historial existente
👉 PUT /api/hmedicos/{id}
📌 Uso:
await actualizarHistorial(3, { diagnostico, tratamiento, receta, cita: { id: 1 } });
*/
export const actualizarHistorial = async (id, historial) => {
    const response = await API.put(`${API_ROUTES.hmedicos}/${id}`, mapearHaciaAPI(historial));
    return mapearDesdeAPI(response.data);
};

/* 
✅ Eliminar un historial
👉 DELETE /api/hmedicos/{id}
📌 Uso:
await eliminarHistorial(4);
*/
export const eliminarHistorial = async (id) => {
    await API.delete(`${API_ROUTES.hmedicos}/${id}`);
    return true;
};

/* 
👁 Ver historiales de un paciente (GET por ID paciente)
👉 GET /api/hmedicos/historial/{idPaciente}
📌 Uso:
const historiales = await verHistorialPorPaciente(2);
*/
export const verHistorialPorPaciente = async (idPaciente) => {
    const response = await API.get(`${API_ROUTES.hmedicos}/historial/${idPaciente}`);
    return response.data.map(mapearDesdeAPI);
};

/* 
📝 Registrar historial desde cita (POST con DTO)
👉 POST /api/hmedicos/historial/registrar
📌 Uso:
await registrarHistorialDesdeCita({
  idCita: 7,
  diagnostico: "Bronquitis",
  tratamiento: "Antibióticos",
  receta: "Amoxicilina"
});
*/
export const registrarHistorialDesdeCita = async (dto) => {
    console.log("registrarHistorialDesdeCita recibió:", dto);
    const response = await API.post(`${API_ROUTES.hmedicos}/historial/registrar`, dto);
    return mapearDesdeAPI(response.data);
};
