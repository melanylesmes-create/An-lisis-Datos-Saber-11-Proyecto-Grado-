
from django.urls import path

from .views import (
    mostrar_resultados_view,
    generar_grafica_areas,
    generar_grafica_comparacion,
    generar_grafica_ranking,
    generar_grafica_mapa_calor,
    generar_grafica_circular,
    generar_grafica_evolucion,
    generar_grafica_caja_bigotes,
)

urlpatterns = [
    path(
        "mostrar-resultados/",
        mostrar_resultados_view,
        name="mostrar_resultados",
    ),
    path(
        "grafica-areas/",
        generar_grafica_areas,
        name="grafica_areas",
    ),
    path(
        "grafica-comparacion/",
        generar_grafica_comparacion,
        name="grafica_comparacion",
    ),
    path(
        "grafica-ranking/",
        generar_grafica_ranking,
        name="grafica_ranking",
    ),
    path(
        "grafica-mapa-calor/",
        generar_grafica_mapa_calor,
        name="grafica_mapa_calor",
    ),
    path(
        "grafica-circular/",
        generar_grafica_circular,
        name="grafica_circular",
    ),
    path(
        "grafica-evolucion/",
        generar_grafica_evolucion,
        name="grafica_evolucion",
    ),
    path(
        "grafica-caja-bigotes/",
        generar_grafica_caja_bigotes,
        name="grafica_caja_bigotes",
    ),
]
