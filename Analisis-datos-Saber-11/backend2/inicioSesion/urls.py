# inicioSesion/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # POST
    path("iniciar/", views.login_view_Post, name="iniciar"),
    # POST
    path("cerrar/", views.cerrar_sesion_Post, name="cerrar"),
    # GET
    path("sesion/", views.sesion_actual_Get, name="sesion"),
    # GET
    path("mostrar/", views.mostrar_usuario_Get, name="mostrar"),
    # POST CREAR USUARIO
    path("crear-usuario/", views.crear_usuario_Post, name="crear-usuario"),
    # PUT EDITAR USUARIO
    path(
        "editar-usuario/<int:id_usuario>/",
        views.editar_usuario_Put,
        name="editar-usuario",
    ),
    # DELETE ELIMINAR USUARIO
    path(
        "eliminar-usuario/<int:id_usuario>/",
        views.eliminar_usuario_Delete,
        name="eliminar-usuario",
    ),
]
