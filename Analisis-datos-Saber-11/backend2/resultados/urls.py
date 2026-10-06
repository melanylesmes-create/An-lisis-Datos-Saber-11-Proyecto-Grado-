# resultados/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("mostrar-resultados", views.mostrar_resultados_view, name="mostrar-resultados"),
]

# GET http://localhost:8000/api/resultados/mostrar-resultados