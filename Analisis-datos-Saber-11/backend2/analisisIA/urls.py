
from django.urls import path
from .views import analizar_resultados_view

urlpatterns = [
    path(
        "analizar/",
        analizar_resultados_view,
        name="analizar_resultados_ia"
    ),
]
