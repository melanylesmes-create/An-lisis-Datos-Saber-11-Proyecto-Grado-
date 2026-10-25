from django.urls import path
from .views import subir_archivo_view, obtener_csrf

urlpatterns = [
    path("subir/", subir_archivo_view, name="subir_archivo"),
    path("csrf/", obtener_csrf, name="obtener_csrf"),
]
# POST http://localhost:8000/api/archivos/subir/