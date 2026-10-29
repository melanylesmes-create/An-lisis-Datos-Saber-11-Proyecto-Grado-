
const API_URL = "http://localhost:3000/api";

export async function generarPreguntas(area, tema, cantidad = 3) {
  const respuesta = await fetch(`${API_URL}/gemini/preguntas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      area,
      tema,
      cantidad: Number(cantidad),
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.error || "No se pudieron generar las preguntas."
    );
  }

  return datos.preguntas;
}


