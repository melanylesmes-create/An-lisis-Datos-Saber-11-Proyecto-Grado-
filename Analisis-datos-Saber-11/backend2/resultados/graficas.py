
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
