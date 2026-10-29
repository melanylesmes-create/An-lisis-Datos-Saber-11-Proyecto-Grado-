import io
import pandas as pd
import matplotlib

# Permite generar gráficas sin abrir ventanas
matplotlib.use("Agg")

import matplotlib.pyplot as plt


# Gráfica de promedios por área
def grafica_promedio_areas(datos):

    areas = {
        "lectura_critica": "Lectura crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales",
        "ciencias_naturales": "Naturales",
        "ingles": "Inglés"
    }

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    # Calculamos los promedios de cada área
    promedios = df[list(areas.keys())].apply(
        pd.to_numeric, errors="coerce"
    ).mean()

    # Colores de las barras
    colores = [
        "#3366CC",
        "#E67E22",
        "#27AE60",
        "#8E44AD",
        "#E74C3C"
    ]

    # Creamos la gráfica
    fig, ax = plt.subplots(figsize=(10, 5))

    barras = ax.bar(
        list(areas.values()),
        promedios.values,
        color=colores,
        width=0.65
    )

    ax.set_title(
        "Promedio por área - Saber 11",
        fontsize=15,
        fontweight="bold"
    )

    ax.set_ylabel("Puntaje promedio")
    ax.set_ylim(0, 100)
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    ax.set_axisbelow(True)

    # Mostramos los valores encima de cada barra
    for barra, valor in zip(barras, promedios.values):
        if pd.notna(valor):
            ax.text(
                barra.get_x() + barra.get_width() / 2,
                valor + 1,
                f"{valor:.1f}",
                ha="center",
                fontsize=11,
                fontweight="bold"
            )

    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()
    fig.savefig(imagen, format="png", dpi=150)

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Gráfica comparativa entre instituciones
def grafica_comparacion_instituciones(datos, area):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    # Validamos el área seleccionada
    if area not in areas:
        raise ValueError("El área seleccionada no es válida.")

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para comparar.")

    # Convertimos los puntajes a números
    df[area] = pd.to_numeric(df[area], errors="coerce")

    # Calculamos el promedio de cada institución
    promedios = (
        df.groupby("nombre_institucion")[area]
        .mean()
        .dropna()
        .sort_values(ascending=False)
    )

    if promedios.empty:
        raise ValueError(
            "No existen puntajes válidos para esta área."
        )

    # Creamos la gráfica horizontal
    fig, ax = plt.subplots(
        figsize=(11, max(5, len(promedios) * 0.5))
    )

    colores = plt.cm.viridis(
        [
            i / max(1, len(promedios) - 1)
            for i in range(len(promedios))
        ]
    )

    barras = ax.barh(
        promedios.index,
        promedios.values,
        color=colores
    )

    # Colocamos el mayor promedio arriba
    ax.invert_yaxis()

    # Mostramos los puntajes en las barras
    ax.bar_label(
        barras,
        fmt="%.1f",
        padding=4
    )

    ax.set_xlim(0, max(100, float(promedios.max()) + 12))
    ax.set_xlabel("Puntaje promedio")

    ax.set_title(
        f"Comparación de instituciones - {areas[area]}",
        fontsize=14,
        fontweight="bold"
    )

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()
    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Mapa de calor de los promedios por institución y área
def grafica_mapa_calor_instituciones(datos):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para analizar.")

    columnas = list(areas.keys())

    # Convertimos los puntajes de cada área a valores numéricos
    for columna in columnas:
        df[columna] = pd.to_numeric(
            df[columna], errors="coerce"
        )

    # Calculamos el promedio de cada institución por área
    promedios = (
        df.groupby("nombre_institucion")[columnas]
        .mean()
        .dropna(how="all")
    )

    if promedios.empty:
        raise ValueError(
            "No existen puntajes válidos para generar el mapa de calor."
        )

    # Creamos la gráfica
    fig, ax = plt.subplots(
        figsize=(10, max(5, len(promedios) * 0.5))
    )

    mapa = ax.imshow(
        promedios.values,
        aspect="auto",
        cmap="YlOrRd",
        vmin=0,
        vmax=100
    )

    # Configuramos las etiquetas de los ejes
    ax.set_xticks(range(len(columnas)))
    ax.set_xticklabels(
        list(areas.values()),
        rotation=20,
        ha="right"
    )

    ax.set_yticks(range(len(promedios)))
    ax.set_yticklabels(promedios.index)

    # Escribimos el promedio dentro de cada celda
    for fila in range(len(promedios)):
        for columna in range(len(columnas)):
            valor = promedios.values[fila, columna]

            if pd.notna(valor):
                color_texto = "white" if valor > 60 else "black"

                ax.text(
                    columna,
                    fila,
                    f"{valor:.1f}",
                    ha="center",
                    va="center",
                    color=color_texto,
                    fontsize=9,
                    fontweight="bold"
                )

    ax.set_title(
        "Mapa de calor - Promedios por institución y área",
        fontsize=14,
        fontweight="bold"
    )

    fig.colorbar(mapa, ax=ax, label="Puntaje promedio")
    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()

    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Gráfica circular con la distribución de los promedios por área
def grafica_circular_areas(datos):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    colores = [
        "#3366CC",
        "#E67E22",
        "#27AE60",
        "#8E44AD",
        "#E74C3C"
    ]

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para analizar.")

    # Calculamos los promedios de cada área
    promedios = df[list(areas.keys())].apply(
        pd.to_numeric, errors="coerce"
    ).mean()

    # Descartamos las áreas sin puntajes válidos
    validos = promedios.dropna()

    if validos.empty:
        raise ValueError("No existen puntajes válidos para esta gráfica.")

    etiquetas = [areas[area] for area in validos.index]
    colores_validos = [
        colores[list(areas.keys()).index(area)]
        for area in validos.index
    ]

    # Creamos la gráfica circular
    fig, ax = plt.subplots(figsize=(8, 8))

    ax.pie(
        validos.values,
        labels=etiquetas,
        colors=colores_validos,
        autopct="%1.1f%%",
        startangle=90,
        counterclock=False
    )

    ax.set_title(
        "Distribución de los promedios por área",
        fontsize=14,
        fontweight="bold"
    )

    ax.axis("equal")
    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()

    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Evolución anual del promedio de un área
def grafica_evolucion_anual(datos, area):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    # Validamos el área seleccionada
    if area not in areas:
        raise ValueError("El área seleccionada no es válida.")

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para analizar.")

    # Convertimos los puntajes a valores numéricos
    df[area] = pd.to_numeric(df[area], errors="coerce")

    # Calculamos el promedio de cada año
    evolucion = (
        df.groupby("anio")[area]
        .mean()
        .dropna()
        .sort_index()
    )

    if evolucion.empty:
        raise ValueError(
            "No existen puntajes válidos para esta área."
        )

    # Creamos la gráfica de líneas
    fig, ax = plt.subplots(figsize=(10, 5))

    ax.plot(
        evolucion.index,
        evolucion.values,
        color="#3366CC",
        marker="o",
        linewidth=2
    )

    # Mostramos el promedio encima de cada punto
    for anio, valor in zip(evolucion.index, evolucion.values):
        ax.text(
            anio,
            valor + 1.5,
            f"{valor:.1f}",
            ha="center",
            fontsize=10,
            fontweight="bold"
        )

    ax.set_title(
        f"Evolución anual - {areas[area]}",
        fontsize=14,
        fontweight="bold"
    )

    ax.set_xlabel("Año")
    ax.set_ylabel("Puntaje promedio")
    ax.set_ylim(0, max(100, float(evolucion.max()) + 12))
    ax.grid(linestyle="--", alpha=0.3)
    ax.set_axisbelow(True)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()

    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Diagrama de caja y bigotes por institución para un área
def grafica_caja_bigotes(datos, area):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    # Validamos el área seleccionada
    if area not in areas:
        raise ValueError("El área seleccionada no es válida.")

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para analizar.")

    # Convertimos los puntajes a valores numéricos
    df[area] = pd.to_numeric(df[area], errors="coerce")
    df = df.dropna(subset=[area])

    if df.empty:
        raise ValueError(
            "No existen puntajes válidos para esta área."
        )

    # Agrupamos los puntajes de cada institución
    grupos = []
    etiquetas = []

    for nombre, grupo in df.groupby("nombre_institucion")[area]:
        valores = grupo.dropna()

        if not valores.empty:
            grupos.append(valores.values)
            etiquetas.append(nombre)

    if not grupos:
        raise ValueError(
            "No existen puntajes válidos para esta área."
        )

    # Creamos la gráfica
    fig, ax = plt.subplots(
        figsize=(11, max(5, len(grupos) * 0.6))
    )

    cajas = ax.boxplot(
        grupos,
        tick_labels=etiquetas,
        patch_artist=True,
        showmeans=True
    )

    # Damos color a las cajas
    for caja in cajas["boxes"]:
        caja.set_facecolor("#3366CC")
        caja.set_alpha(0.65)

    ax.set_title(
        f"Distribución de los puntajes - {areas[area]}",
        fontsize=14,
        fontweight="bold"
    )

    ax.set_ylabel("Puntaje")
    ax.set_ylim(0, max(100, float(df[area].max()) + 12))
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    ax.set_axisbelow(True)

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    # Giramos los nombres de las instituciones para que no se superpongan
    ax.tick_params(axis="x", rotation=75, labelsize=8)

    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()

    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()


# Genera un ranking de instituciones por área Saber 11
def grafica_ranking_instituciones(datos, area):

    areas = {
        "lectura_critica": "Lectura Crítica",
        "matematicas": "Matemáticas",
        "ciencias_sociales": "Sociales y Ciudadanas",
        "ciencias_naturales": "Ciencias Naturales",
        "ingles": "Inglés"
    }

    # Validamos el área seleccionada
    if area not in areas:
        raise ValueError("El área seleccionada no es válida.")

    # Convertimos los registros en un DataFrame
    df = pd.DataFrame(datos)

    if df.empty:
        raise ValueError("No existen registros para analizar.")

    # Convertimos los puntajes a valores numéricos
    df[area] = pd.to_numeric(df[area], errors="coerce")

    # Agrupamos los puntajes por institución
    ranking = (
        df.groupby("nombre_institucion")[area]
        .mean()
        .dropna()
        .sort_values(ascending=False)
    )

    if ranking.empty:
        raise ValueError("No existen puntajes válidos para esta área.")

    # Seleccionamos hasta las 5 mejores instituciones
    mejores = ranking.head(5)

    # Seleccionamos hasta las 5 de menor puntaje,
    # sin repetir instituciones
    restantes = ranking.drop(mejores.index)
    menores = restantes.tail(5)

    # Organizamos las instituciones seleccionadas
    seleccionadas = pd.concat([mejores, menores])

    # Colores para diferenciar los grupos
    colores = (
        ["#3366CC"] * len(mejores)
        + ["#E67E22"] * len(menores)
    )

    # Creamos la gráfica
    fig, ax = plt.subplots(
        figsize=(11, max(5, len(seleccionadas) * 0.6))
    )

    barras = ax.barh(
        seleccionadas.index,
        seleccionadas.values,
        color=colores
    )

    # Mostramos el mayor puntaje arriba
    ax.invert_yaxis()

    # Agregamos los puntajes a las barras
    ax.bar_label(
        barras,
        fmt="%.1f",
        padding=4
    )

    ax.set_xlim(0, 110)
    ax.set_xlabel("Puntaje por área")

    ax.set_title(
        f"Ranking de instituciones - {areas[area]}",
        fontsize=14,
        fontweight="bold"
    )

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.tight_layout()

    # Guardamos la imagen en memoria
    imagen = io.BytesIO()

    fig.savefig(
        imagen,
        format="png",
        dpi=150,
        bbox_inches="tight"
    )

    plt.close(fig)
    imagen.seek(0)

    return imagen.getvalue()