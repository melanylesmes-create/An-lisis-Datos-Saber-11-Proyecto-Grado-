# subirArchivo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    #POST
    path("subir/", views.subir_archivo_view, name="subir"),
]

# POST http://localhost:8000/api/archivos/subir/