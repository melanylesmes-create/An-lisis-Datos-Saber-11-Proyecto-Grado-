
from ollama import chat

def analizar_resultados(resultado):

    promedios = resultado["promedios"]
    area_mayor = resultado["area_mayor"]
    area_menor = resultado["area_menor"]

    respuesta = chat(
        model="llama3.2:1b",
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un asistente de análisis educativo. "
                    "Responde en español de manera clara, breve y objetiva. "
                    "No inventes cifras, causas ni conclusiones. "
                    "No recalcules ni cambies los resultados proporcionados. "
                    "Utiliza exactamente las áreas de mayor y menor promedio "
                    "que se te indican."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Estos son los promedios de Saber 11: {promedios}. "
                    f"El área con mayor promedio es {area_mayor['nombre']} "
                    f"con {area_mayor['puntaje']} puntos. "
                    f"El área con menor promedio es {area_menor['nombre']} "
                    f"con {area_menor['puntaje']} puntos. "
                    "Redacta un párrafo breve que explique estas diferencias. "
                    "No afirmes que los estudiantes tienen buen o mal rendimiento "
                    "sin criterios adicionales que lo justifiquen."
                )
            }
        ],
        options={"temperature": 0}
    )

    return respuesta.message.content
