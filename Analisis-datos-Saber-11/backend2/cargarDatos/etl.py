import pandas as pd

#=====================================
# EXTRACCIÓN DE DATOS

def extraer_datos(archivo, extension):

    if extension == "csv":
        # Detectamos automáticamente el separador del CSV
        datos = pd.read_csv(
            archivo,
            sep=None,
            engine="python",
            dtype=str
        )

    elif extension == "xlsx":
        # El Excel oficial tiene los encabezados
        # en la fila 7 (índice 6 de Pandas).
        datos = pd.read_excel(
            archivo,
            header=6,
            dtype=str
        )

    else:
        raise ValueError("Formato de archivo no permitido")

    return datos

# Normalizar nombres de columnas del ICFES
def normalizar_columnas(datos):

    # Creamos una copia para no modificar los datos originales
    datos = datos.copy()

    # Relacionamos los nombres oficiales con los de nuestro proyecto
    equivalencias = {
        "CODINST": "codigo_icfes", "NOMBREINSTITUCION": "nombre_institucion",
        "CODIGOMUNICIPIO": "codigo_municipio","NOMBREMUNICIPIO": "ciudad",
        "DEPARTAMENTO": "departamento", "NATURALEZA": "naturaleza",
        "PROMLECTURACRITICA": "lectura_critica", "PROMMATEMATICA": "matematicas",
        "PROMSOCIALESYCIUDADANAS": "ciencias_sociales", "PROMCIENCIASNATURALES": "ciencias_naturales",
        "PROMINGLES": "ingles", "PERIODO": "periodo_icfes"}

    # Cambiamos los nombres utilizando el diccionario
    datos = datos.rename(columns=equivalencias)

    return datos

# FILTRAR POPAYAN 
def filtrar_popayan(datos):

    # Creamos una copia para no modificar el original
    datos = datos.copy()

    # Verificamos que exista la columna ciudad
    if "ciudad" not in datos.columns:
        raise ValueError(
            "No existe la columna ciudad para filtrar Popayán."
        )

    # Filtramos los registros correspondientes a Popayán
    datos = datos[
        datos["ciudad"].str.upper().str.strip() == "POPAYÁN"
    ]

    # Reiniciamos los índices después del filtrado
    datos = datos.reset_index(drop=True)

    return datos

#=========================================
# VALIDAR ESTRUCTURA

def validar_estructura(datos):
  # Columnas obligatorias del archivo oficial
    columnas_requeridas = [
        "nombre_institucion",
        "periodo_icfes",
        "lectura_critica",
        "matematicas",
        "ciencias_sociales",
        "ciencias_naturales",
        "ingles"
    ]

    # Identificamos las columnas que faltan
    columnas_faltantes = [
        columna
        for columna in columnas_requeridas
        if columna not in datos.columns
    ]

    # Si faltan columnas, mostramos un error
    if columnas_faltantes:
        raise ValueError(
            f"Faltan las columnas: {columnas_faltantes}"
        )

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
# T - TRANSFORMAR DATOS

def transformar_datos(datos):
    # Creamos una copia de los datos
    datos_transformados = datos.copy()

    # Columnas que contienen puntajes numéricos
    columnas_numericas = ["lectura_critica", "matematicas", "ciencias_sociales", "ciencias_naturales", "ingles", "puntaje_global"]

    # Convertimos los puntajes a valores numéricos
    for columna in columnas_numericas:
        if columna in datos_transformados.columns:
            datos_transformados[columna] = pd.to_numeric( datos_transformados[columna], errors="coerce")

    # Convertimos el período oficial a texto
    periodo = datos_transformados["periodo_icfes"].astype("string").str.strip()

    # Extraemos el año y el semestre
    datos_transformados["anio"] = pd.to_numeric( periodo.str[:4], errors="coerce")

    datos_transformados["periodo"] = pd.to_numeric(periodo.str[4:], errors="coerce" )

    return datos_transformados

# ==========================================================
# T - VALIDACIÓN DE LOS DATOS

def validar_datos(datos):

    errores = []

    # Campos obligatorios para cada institución
    campos_obligatorios = ["nombre_institucion","periodo_icfes","lectura_critica","matematicas","ciencias_sociales","ciencias_naturales","ingles" ]

    # Recorremos cada registro del archivo
    for indice, fila in datos.iterrows():
        numero_fila = indice + 8

        # Comprobar campos vacíos
        for campo in campos_obligatorios:
            if pd.isna(fila.get(campo)):
                errores.append({"fila": numero_fila, "campo": campo, "mensaje": "El campo está vacío."})

        # Validar puntajes entre 0 y 100
        for campo in [
            "lectura_critica","matematicas","ciencias_sociales","ciencias_naturales","ingles" ]:
            
            valor = fila.get(campo)
            if pd.notna(valor) and not (0 <= valor <= 100):
                errores.append({
                    "fila": numero_fila,
                    "campo": campo,
                    "mensaje": "El puntaje debe estar entre 0 y 100."
                })

        # Validar año y período
        anio = fila.get("anio")
        periodo = fila.get("periodo")

        if (
            pd.isna(anio)
            or pd.isna(periodo) or not (1900 <= anio <= 2100) or periodo not in (1, 2) or len(str(fila.get("periodo_icfes")).strip()) != 5  ):
            errores.append({
                "fila": numero_fila,
                "campo": "periodo_icfes",
                "mensaje": "El período debe tener el formato AAAA1 o AAAA2."
            })

    return errores

# ==========================================================
# T - IDENTIFICAR CÓDIGOS DANE FALTANTES

def identificar_codigos_dane(datos):

    # Creamos una copia de los registros
    datos = datos.copy()

    # Si no existe el código DANE, creamos la columna vacía
    if "codigo_dane" not in datos.columns:
        datos["codigo_dane"] = pd.NA

    # Marcamos los códigos que requieren verificación
    datos["estado_dane"] = "Pendiente de verificar"

    # Identificamos instituciones sin código DANE
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
