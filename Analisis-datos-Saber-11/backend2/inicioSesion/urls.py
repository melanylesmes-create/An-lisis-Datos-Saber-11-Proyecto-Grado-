# inicioSesion/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login_prueba"),
    path("crear-usuario/", views.crear_usuario_prueba_view, name="crear_usuario_prueba"),
]