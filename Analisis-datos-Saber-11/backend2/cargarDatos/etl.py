import pandas as pd


def extraer_datos(archivo, extension):
    if extension == "csv":
        datos = pd.read_csv(archivo)

    elif extension == "xlsx":
        datos = pd.read_excel(archivo)

    else:
        raise ValueError("Formato de archivo no permitido")

    return datos

# T - TRANSFORMACIÓN
def validar_estructura(datos):

    # Columnas que esperamos encontrar en el archivo.
    # Estas son necesarias para poder procesar los resultados.
    columnas_requeridas = [ "codigo_dane", "nombre_institucion", "referencia", "puntaje_global",
        "lectura_critica", "matematicas", "ciencias_sociales", "ciencias_naturales","ingles_nivel" ]

    # Aquí guardaremos las columnas que NO encontremos.
    columnas_faltantes = []

    # Recorremos cada columna requerida.
    for columna in columnas_requeridas:

        # Si la columna no existe en el archivo,
        # la agregamos a la lista de faltantes.
        if columna not in datos.columns:
            columnas_faltantes.append(columna)

    # EX02:
    # Si falta al menos una columna, la estructura
    # del archivo no corresponde a la esperada.
    if columnas_faltantes:
        raise ValueError(
            f"Estructura incorrecta. Faltan las columnas: {columnas_faltantes}"
        )

    # Si no faltó ninguna columna, la estructura es válida.
    return True

# Segunda parte: limpiar los datos

def limpiar_datos(datos):

    # Creamos una copia de los datos.
    # Así evitamos modificar directamente los datos originales
    datos_limpios = datos.copy()

    # Quitamos espacios innecesarios de los nombres
    # de las columnas.
    datos_limpios.columns = datos_limpios.columns.str.strip()

    # Reemplazamos valores que representan
    # datos faltantes por el valor estándar de Pandas.
    #
    # N.D. = No disponible
    # N/A  = Not availible
    # " "   = vacio
    datos_limpios = datos_limpios.replace(
        ["N.D.", "N.D", "N/A", ""],
        pd.NA
        # NA = en pandas (pd) representa que falta un dato :D
    )

    # Eliminamos filas completamente vacías.
    # Si toda la fila está vacía, no tiene información útil
    datos_limpios = datos_limpios.dropna(how="all")

    # Devolvemos los datos ya limpiados.
    return datos_limpios


# Tercera parte: validar la referencia

def procesar_referencia(referencia):

    # Convertimos la referencia a texto y quitamos
    # espacios que puedan venir del Excel.
    referencia = str(referencia).strip()

    # Separamos el texto usando el guion.
    # "2025-1" -> ["2025", "1"]
    partes = referencia.split("-")

    # La referencia debe tener exactamente dos partes:
    # el año y el periodo.
    if len(partes) != 2:
        raise ValueError(
            f"Referencia '{referencia}' incorrecta. "
            "Debe tener el formato AAAA-1 o AAAA-2."
        )

    # Guardamos cada parte por separado.
    anio_texto = partes[0]
    periodo_texto = partes[1]

    # Verificamos que ambas partes sean números.
    if not anio_texto.isdigit() or not periodo_texto.isdigit():
        raise ValueError(
            f"Referencia '{referencia}' incorrecta."
        )

    # Convertimos los textos a números enteros.
    anio = int(anio_texto)
    periodo = int(periodo_texto)

    # Solo permitimos periodo 1 o periodo 2.
    if periodo not in (1, 2):
        raise ValueError(
            f"El periodo de '{referencia}' debe ser 1 o 2."
        )

    # Devolvemos los dos valores por separado.
    return anio, periodo

# EX03 - VALIDAR DATOS OBLIGATORIOS

def validar_datos(datos):

    # Datos que no pueden estar vacíos.
    campos_obligatorios = [ "codigo_dane", "nombre_institucion", "referencia", "lectura_critica", "matematicas",
        "ciencias_sociales", "ciencias_naturales","ingles"]

    # Recorremos cada fila del archivo.
    for indice, fila in datos.iterrows():

        # Revisamos los campos obligatorios.
        for campo in campos_obligatorios:

            # pd.isna() detecta valores vacíos o  los NA que tiene pandas
            if pd.isna(fila.get(campo)):
                raise ValueError(
                    f"Fila {indice + 2}: falta el campo '{campo}'."
                )

        # También comprobamos que la referencia sea válida.
        procesar_referencia(fila.get("referencia"))

    return True