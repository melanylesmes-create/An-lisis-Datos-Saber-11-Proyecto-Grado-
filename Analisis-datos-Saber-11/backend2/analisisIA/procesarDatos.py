
import pandas as pd


def calcular_promedios(registros):

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(registros)

    # Áreas evaluadas en Saber 11
    areas = {
        "lectura_critica": "Lectura crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y ciudadanas",
        "ciencias_naturales": "Ciencias naturales",
        "ingles": "Inglés"
    }

    promedios = {}

    # Calculamos el promedio de cada área
    for columna, nombre in areas.items():

        valores = pd.to_numeric(
            df[columna], errors="coerce"
        )

        promedio = valores.mean()

        if pd.notna(promedio):
            promedios[nombre] = round(float(promedio), 2)
        area_mayor = max(promedios, key=promedios.get)
        area_menor = min(promedios, key=promedios.get)

    return {
    "promedios": promedios,
    "area_mayor": {
        "nombre": area_mayor,
        "puntaje": promedios[area_mayor]
    },
    "area_menor": {
        "nombre": area_menor,
        "puntaje": promedios[area_menor]
    }
}
