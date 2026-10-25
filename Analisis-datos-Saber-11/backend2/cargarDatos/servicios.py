# Importamos las funciones que están en etl.py
from .etl import (extraer_datos, normalizar_columnas, limpiar_datos, validar_estructura, diagnosticar_datos, transformar_datos, validar_datos,identificar_codigos_dane,
                  filtrar_popayan)

def ejecutar_etl(archivo, extension):

    # 1. Extraer los datos
    datos = extraer_datos(archivo, extension)

    # 2. Normalizar los encabezados
    datos = normalizar_columnas(datos)

    # 3. Limpiar los registros
    datos = limpiar_datos(datos)

    # 4. Validar la estructura
    validar_estructura(datos)

    # 5. Obtener diagnóstico del archivo completo
    diagnostico = diagnosticar_datos(datos)

    # 6. Filtrar los registros de Popayán
    datos = filtrar_popayan(datos)

    # 7. Transformar los datos
    datos = transformar_datos(datos)

    # 8. Validar los registros
    errores = validar_datos(datos)

    # 9. Identificar códigos DANE pendientes
    datos = identificar_codigos_dane(datos)

    return {
        "datos": datos,
        "diagnostico": diagnostico,
        "errores": errores
    }