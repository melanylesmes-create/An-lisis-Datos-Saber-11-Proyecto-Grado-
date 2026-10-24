import pandas as pd

#=====================================
# EXTRACCIÓN DE DATOS
#=====================================
def extraer_datos(archivo, extension):
    #Lee un archivo Excel o CSV y devuelve un DataFrame.
    #DataFrame: tabla de pandas que contiene filas y columnas

    extension = extension.lower().strip()

    if extension == "csv":
        # sep=None Identifica si el separador es "," o ";"
        datos = pd.read_csv(archivo, sep=None, engine="python", dtype=str)

    elif extension == "xlsx":
        #dtype=str conserva los códigos como,evita perder ceros iniciales en los identificador
        datos = pd.read_excel(archivo, dtype=str)

    else:
        raise ValueError("Formato de archivo no permitido")

    return datos

#=========================================
# VALIDAR ESTRUCTURA

def validar_estructura(datos):
    #Comprobar que el archivo tenga las columnas necesarias para procesar los 
    #resultados de Saber 11.
    columnas_requeridas =[
        "nombre_institución", "referencia", "lectura_critica", "matematicas", "ciencias_sociales",
        "ciencias_naturales", "ingles"
    ]

    #identificar las columnas que no estan en el archivo.
    columnas_faltantes =[
        columna for columna in columnas_requeridas
        if columna not in datos.columns
    ]

    if columnas_faltantes:
        raise ValueError("Faltan las columnas: {columnas_faltantes}")

    #Codigo_dane y puntaje globlal no son obligatorias, porque pueden necesitar verificación.
    return True

# ==========================================================
# T - LIMPIEZA DE DATOS

def limpiar_datos(datos):
    #Limpia los nombres de las columnas y los valores vacíos.
    # Trabajamos con una copia para conservar los datos originales en memoria.
    datos_limpios = datos.copy()

    # Quitamos espacios y normalizamos los encabezados. Ejemplo: " Matemáticas " -> "matemáticas"
    datos_limpios.columns = ( datos_limpios.columns.astype(str).str.strip().str.lower())

    # Quitamos espacios al inicio y al final de los textos.
    for columna in datos_limpios.columns:
        datos_limpios[columna] = (datos_limpios[columna].astype("string").str.strip())

    # Identificamos posibles representaciones de valores faltantes.
    datos_limpios = datos_limpios.replace(["N.D.", "N.D", "N/A", "", "NULL", "null"],pd.NA)

    # Eliminamos filas que no contienen ningún dato.
    datos_limpios = datos_limpios.dropna(how="all")

    # Si el archivo no tiene código DANE, creamos la columna para completarla posteriormente.
    if "codigo_dane" not in datos_limpios.columns: 
        datos_limpios["codigo_dane"] = pd.NA

    # Si no existe puntaje global, también lo creamos vacío.
    if "puntaje_global" not in datos_limpios.columns:
        datos_limpios["puntaje_global"] = pd.NA

    return datos_limpios

# ==========================================================
# T - DIAGNÓSTICO DEL ARCHIVO

def diagnosticar_datos(datos):
    # isnull().sum() cuenta los valores faltantes de cada columna.
    valores_nulos = datos.isnull().sum().to_dict()

    # dtypes permite conocer los tipos de datos.
    tipos_datos = {
        columna: str(tipo)
        for columna, tipo in datos.dtypes.items()
    }

    # duplicated() identifica filas exactamente repetidas.
    duplicados = int(datos.duplicated().sum())

    return {
        "total_registros": len(datos), "total_columnas": len(datos.columns),"columnas": datos.columns.tolist(),
        "valores_nulos": { columna: int(cantidad) for columna, cantidad in valores_nulos.items()},
        "tipos_datos": tipos_datos,"filas_duplicadas": duplicados
    }

# ==========================================================
# T - PROCESAR REFERENCIA

def procesar_referencia(referencia):

    #Separa 2025 de 1 en año:2025, periodo =1
    if pd.isna(referencia):
        raise ValueError("La referencia está vacía.")

    referencia = str(referencia).strip()
    partes = referencia.split("-")

    if len(partes) != 2:
        raise ValueError(f"Referencia '{referencia}' incorrecta. ""Debe tener el formato AAAA-1 o AAAA-2."
        )

    anio_texto, periodo_texto = partes

    if (len(anio_texto) != 4 or not anio_texto.isdigit() or not periodo_texto.isdigit()):
        raise ValueError(
            f"Referencia '{referencia}' incorrecta."
        )

    anio = int(anio_texto)
    periodo = int(periodo_texto)

    if periodo not in (1, 2):
        raise ValueError(
            "El período debe ser 1 o 2."
        )

    return anio, periodo
# ==========================================================
# T - TRANSFORMAR LOS PUNTAJES

def transformar_datos(datos):

    datos_transformados = datos.copy()
    columnas_numericas = ["lectura_critica","matematicas","ciencias_sociales","ciencias_naturales","ingles","puntaje_global"]

    for columna in columnas_numericas:
        if columna in datos_transformados.columns:

            # errors="coerce" convierte valores no numéricos en NaN, para que podamos detectarlos después.
            datos_transformados[columna] = pd.to_numeric(datos_transformados[columna], errors="coerce")

    # Separamos año y período. Si una referencia es incorrecta, se registrará
    anios = []
    periodos = []

    for referencia in datos_transformados["referencia"]:
        try:
            anio, periodo = procesar_referencia(referencia)
        except ValueError:
            anio, periodo = None, None

        anios.append(anio)
        periodos.append(periodo)

    datos_transformados["anio"] = anios
    datos_transformados["periodo"] = periodos

    return datos_transformados

# ==========================================================
# T - VALIDACIÓN DE LOS DATOS

def validar_datos(datos):

    errores = []

    campos_obligatorios = ["nombre_institucion","referencia","lectura_critica","matematicas","ciencias_sociales","ciencias_naturales","ingles"]

    for indice, fila in datos.iterrows():

        # Suponemos encabezados en la primera fila.
        # Por eso el primer registro corresponde a Excel fila 2.
        numero_fila = indice + 2

        for campo in campos_obligatorios:

            if pd.isna(fila.get(campo)):
                errores.append({"fila": numero_fila, "campo": campo, "mensaje": f"Falta el campo '{campo}'."})

        # Verificamos que la referencia tenga un formato válido.
        try:
            procesar_referencia(fila.get("referencia"))
        except ValueError as error:
            errores.append({"fila": numero_fila,"campo": "referencia","mensaje": str(error) })

        # Verificamos los rangos de los puntajes por área.
        for campo in ["lectura_critica","matematicas","ciencias_sociales","ciencias_naturales","ingles"]:
            valor = fila.get(campo)

            if pd.notna(valor) and not (0 <= valor <= 100):
                errores.append({"fila": numero_fila, "campo": campo, "mensaje": "El puntaje debe estar entre 0 y 100."})

        # Si existe un puntaje global, validamos su rango.
        puntaje_global = fila.get("puntaje_global")

        if pd.notna(puntaje_global) and not (
            0 <= puntaje_global <= 500
        ):
            errores.append({"fila": numero_fila, "campo": "puntaje_global","mensaje": "El puntaje global debe estar entre 0 y 500."})

    return errores

# ==========================================================
# T - IDENTIFICAR CÓDIGOS DANE FALTANTES

def identificar_codigos_dane(datos):
    datos = datos.copy()

    datos["estado_dane"] = "Pendiente de verificar"

    datos.loc[
        datos["codigo_dane"].isna(),
        "estado_dane"
    ] = "Falta código DANE"

    return datos

# ==========================================================
# CÁLCULO AUXILIAR DEL PUNTAJE GLOBAL

def calcular_puntaje_global(lc, mat, soc, cn, ing):
    promedio = ( (lc * 3) + (mat * 3) + (soc * 3) + (cn * 3) + ing) / 13

    return round(promedio * 5)
