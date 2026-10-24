# Importamos las funciones que están en etl.py
from .etl import (extraer_datos, limpiar_datos, validar_estructura, diagnosticar_datos, transformar_datos, validar_datos,identificar_codigos_dane,)


# Función encargada de coordinar el ETL
def ejecutar_etl(archivo, extension):

    # E - Extraer los datos del archivo
    datos = extraer_datos(archivo, extension)

    # T - Limpiar los datos
    datos = limpiar_datos(datos)

    # Comprobar que existan las columnas necesarias
    validar_estructura(datos)

    # Obtener información del archivo
    diagnostico = diagnosticar_datos(datos)

    # Convertir los puntajes y separar año y período
    datos = transformar_datos(datos)

    # Identificar errores en los registros
    errores = validar_datos(datos)

    # Identificar instituciones sin código DANE
    datos = identificar_codigos_dane(datos)

    # Devolver los resultados procesados
    return {
        "datos": datos,
        "diagnostico": diagnostico,
        "errores": errores
    }