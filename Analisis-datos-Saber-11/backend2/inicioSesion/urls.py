# inicioSesion/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # POST
    path("iniciar/", views.login_view, name="iniciar"),
    # GET
    path ("mostrar/", views.mostrar_usuario_view, name = "mostrar"),
    #POST CREAR USUARIO
    path("crear-usuario/", views.crear_usuario_prueba_view, name="crear-usuario"),
]