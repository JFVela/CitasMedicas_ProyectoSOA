const BASE = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8091";

export const obtenerSedes = async () => {
    const response = await fetch(`${BASE}/api/sedes`);
    if (!response.ok) throw new Error("Error al obtener sedes");
    return await response.json();
};

export const obtenerEspecialidades = async () => {
    const response = await fetch(`${BASE}/api/especialidades`);
    if (!response.ok) throw new Error("Error al obtener especialidades");
    return await response.json();
};

export const obtenerDisponibilidadesFiltradas = async (idSede, idEspecialidad) => {
    const response = await fetch(`${BASE}/api/disponibilidades`);
    if (!response.ok) throw new Error("Error al obtener disponibilidades");

    const data = await response.json();

    // Filtrar por sede y especialidad (del doctor)
    return data.filter((disp) =>
        disp.sede?.idsede === idSede &&
        disp.doctor?.especialidad?.idespecialidad === idEspecialidad
    );
};

export const registrarCita = async ({ dni, idDisponibilidad, motivo }) => {
    const response = await fetch(`${BASE}/api/registro-cita`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            dni,
            idDisponibilidad,
            motivo,
        }),
    });

    const text = await response.text();
    if (!response.ok) throw new Error(`Error: ${text}`);
    return text; // o JSON si así lo retornas
};
