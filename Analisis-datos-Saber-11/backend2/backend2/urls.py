"""
URL configuration for backend2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

 

#urlpatterns = [
 #    path("login/", views.login_view, name="login_prueba"),
  #  path("crear-usuario/", views.crear_usuario_prueba_view, name="crear_usuario_prueba"),
#]

urlpatterns = [
   path("admin/", admin.site.urls),
    path("api/login/", include("inicioSesion.urls"))
    #path("api/archivos/", include("subirArchivos.urls")),
    #path("api/resultados/", include("resultados.urls")) ,
 ]

# Endpoints finales:
#   POST   http://localhost:8000/api/login-prueba/crear-usuario/   -> crea un usuario de prueba
#   POST   http://localhost:8000/api/login-prueba/login/           -> inicia sesion
#   GET    http://localhost:8000/api/login-prueba/login/           -> lista usuarios (para copiar un id_usuario)
#   PUT/PATCH http://localhost:8000/api/login-prueba/login/?correo=...&contrasena=...  -> actualiza clave
#   DELETE http://localhost:8000/api/login-prueba/login/?correo=...  -> elimina el usuario


