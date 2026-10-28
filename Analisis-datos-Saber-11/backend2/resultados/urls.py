
from django.urls import path

from .views import (
    mostrar_resultados_view,
    generar_grafica_areas,
    generar_grafica_comparacion,
    generar_grafica_ranking,
)

urlpatterns = [
    # Consultar resultados
    path(
        "mostrar-resultados/",
        mostrar_resultados_view,
        name="mostrar_resultados"
    ),

    # Gráfica de promedios por área
    path(
        "grafica-areas/",
        generar_grafica_areas,
        name="grafica_areas"
    ),

    # Comparación entre instituciones
    path(
        "grafica-comparacion/",
        generar_grafica_comparacion,
        name="grafica_comparacion"
    ),

    # Ranking de instituciones por área
    path(
        "grafica-ranking/",
        generar_grafica_ranking,
        name="grafica_ranking"
    ),
]

