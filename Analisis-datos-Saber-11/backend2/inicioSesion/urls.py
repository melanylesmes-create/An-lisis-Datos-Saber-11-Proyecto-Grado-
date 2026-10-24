# inicioSesion/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # POST
    path("iniciar/", views.login_view_Post, name="iniciar"),
    # GET
    path ("mostrar/", views.mostrar_usuario_Get, name = "mostrar"),
    #POST CREAR USUARIO
    path("crear-usuario/", views.crear_usuario_Post, name="crear-usuario"),
]