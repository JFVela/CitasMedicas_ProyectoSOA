import API from "../AxiosConfig";
import { API_ROUTES } from "../apiRoutes";

const mapearDesdeAPI = (disponibilidadAPI) => ({
    id: disponibilidadAPI.idDispon?.toString(),
    doctor: {
        id: disponibilidadAPI.doctor?.idDoctor?.toString() || "",
        nombres: disponibilidadAPI.doctor?.nombres || "",
        apellidos: disponibilidadAPI.doctor?.apellidos || "",
        dni: disponibilidadAPI.doctor?.dni || "",
        cmp: disponibilidadAPI.doctor?.cmp || "",
        celular: disponibilidadAPI.doctor?.celular || "",
        estado: disponibilidadAPI.doctor?.estado === 1 ? "Activo" : "Inactivo",
        nombreCompleto: `${disponibilidadAPI.doctor?.nombres || ""} ${disponibilidadAPI.doctor?.apellidos || ""}`.trim(),
        especialidad: {
            id: disponibilidadAPI.doctor?.especialidad?.idespecialidad?.toString() || "",
            nombre: disponibilidadAPI.doctor?.especialidad?.nombre || "Sin Especialidad",
        },
    },
    sede: {
        id: disponibilidadAPI.sede?.idsede?.toString() || "",
        nombre: disponibilidadAPI.sede?.nombre || "",
        direccion: disponibilidadAPI.sede?.direccion || "",
        distrito: disponibilidadAPI.sede?.distrito || "",
        estado: disponibilidadAPI.sede?.estado === 1 ? "Activo" : "Inactivo",
    },
    horario: {
        id: disponibilidadAPI.horario?.idHorario?.toString() || "",
        dia: disponibilidadAPI.horario?.diaSemana || "",
        horaInicio: disponibilidadAPI.horario?.horaInicio || "",
        horaFin: disponibilidadAPI.horario?.horaFin || "",
        estado: disponibilidadAPI.horario?.estado === 1 ? "Activo" : "Inactivo",
        textoCompleto: disponibilidadAPI.horario
            ? `${disponibilidadAPI.horario.diaSemana} ${disponibilidadAPI.horario.horaInicio?.slice(0, 5)} - ${disponibilidadAPI.horario.horaFin?.slice(0, 5)}`
            : "",
    },
    fechaInicio: disponibilidadAPI.fechaInicio || "",
    fechaFin: disponibilidadAPI.fechaFin || "",
    estado: disponibilidadAPI.estado === 1 ? "Activo" : "Inactivo",
});

const mapearHaciaAPI = (disponibilidadLocal) => ({
    fechaInicio: disponibilidadLocal.fechaInicio,
    fechaFin: disponibilidadLocal.fechaFin,
    estado: disponibilidadLocal.estado === "Activo" ? 1 : 0,
    doctor: {
        idDoctor: parseInt(disponibilidadLocal.doctor.id, 10),
    },
    sede: {
        idsede: parseInt(disponibilidadLocal.sede.id, 10),
    },
    horario: {
        idHorario: parseInt(disponibilidadLocal.horario.id, 10),
    }
});

export const obtenerDisponibilidades = async () => {
    try {
        const response = await API.get(API_ROUTES.disponibilidades);
        return response.data.map(mapearDesdeAPI);
    } catch (error) {
        throw error;
    }
};

export const crearDisponibilidad = async (disponibilidad) => {
    const data = mapearHaciaAPI(disponibilidad);
    try {
        const response = await API.post(API_ROUTES.disponibilidades, data);
        const id = response.data.idDispon || response.data.id;
        const disponibilidadCompleta = await API.get(`${API_ROUTES.disponibilidades}/${id}`);
        return mapearDesdeAPI(disponibilidadCompleta.data);
    } catch (error) {
        throw error;
    }
};

export const actualizarDisponibilidad = async (id, disponibilidad) => {
    const data = mapearHaciaAPI(disponibilidad);
    try {
        const response = await API.put(`${API_ROUTES.disponibilidades}/${id}`, data);
        return mapearDesdeAPI(response.data);
    } catch (error) {
        throw error;
    }
};

export const eliminarDisponibilidad = async (id, disponibilidad) => {
    try {
        await API.delete(`${API_ROUTES.disponibilidades}/${id}`);
        return true;
    } catch (error) {
        console.error("No se pudo eliminar. Intentando inactivarlo...", error);

        // Si no se puede eliminar, se intenta actualizar el estado a "Inactivo"
        try {
            const disponibilidadInactiva = {
                ...disponibilidad,
                estado: "Inactivo",
            };
            await actualizarDisponibilidad(id, disponibilidadInactiva);
            return "Inactivado";
        } catch (updateError) {
            console.error("No se pudo inactivar la disponibilidad", updateError);
            return false;
        }
    }
};
