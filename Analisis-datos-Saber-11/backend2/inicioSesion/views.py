from django.shortcuts import render
# Create your views here.
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, Rol
  
@csrf_exempt
def login_view(request):
 
    # POST -> validar credenciales (Create de la sesion)
    if request.method == "POST":

        try:
            # Convierte el JSON recibido a datos de Python
            datos = json.loads(request.body)
            # Obtiene correo y contraseña del JSON
            correo = datos.get("correo")
            contrasena = datos.get("contrasena")

            # Busca el usuario en PostgreSQL
            usuario = Usuario.objects.get( correo=correo, contrasena=contrasena)
 
            return JsonResponse({
                "mensaje": "Login exitoso",
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "rol": usuario.id_rol.nombre_rol,
            })
    
        except Usuario.DoesNotExist:

            return JsonResponse({
                "error": "Correo o contrasena incorrectos"
            }, status=401)
 

@csrf_exempt
def mostrar_usuario_view (request):

    # GET -> usuarios de prueba (Read), util para copiar un id_usuario real
    if request.method == "GET":
        usuarios = Usuario.objects.select_related("id_rol").all()
        data = [
            {
                "id_usuario": u.id_usuario,
                "nombre": u.nombre,
                "correo": u.correo,
                "rol": u.id_rol.nombre_rol,
            }
            for u in usuarios
        ]
        return JsonResponse({"usuarios": data}, safe=False)


 

@csrf_exempt
def crear_usuario_prueba_view(request):

    if request.method == "POST":

        try:

            # Lee el JSON enviado desde Postman
            datos = json.loads(request.body)

            # Obtiene el rol enviado
            nombre_rol = datos.get("rol")

            if nombre_rol =="funcionario" or nombre_rol == "administrador":
                 # Si es válido, buscamos el rol en PostgreSQL
                rol = Rol.objects.get(nombre_rol=nombre_rol)
            else: 
                return JsonResponse({
                    "error": "El rol ingresado no es válido"
                }, status=400)
            
            # Validamos campos obligatorios
            if not datos.get("numero_identificacion"):
                return JsonResponse({
                    "error": "numero_identificacion es obligatorio"
                }, status=400)

            if not datos.get("nombre"):
                return JsonResponse({
                    "error": "nombre es obligatorio"
                }, status=400)

            if not datos.get("correo"):
                return JsonResponse({
                    "error": "correo es obligatorio"
                }, status=400)

            # Guarda el usuario en PostgreSQL
            usuario = Usuario.objects.create(

                id_rol=rol,
                tipo_identificacion=datos.get("T.I","C.C"),
                numero_identificacion=datos.get(
                    "numero_identificacion"
                ),
                nombre=datos.get("nombre"),
                apellido=datos.get("apellido"),
                contrasena=datos.get("contrasena"),
                correo=datos.get("correo")
            )

            return JsonResponse({
                "mensaje": "Usuario creado correctamente",
                "id_usuario": usuario.id_usuario
            }, status=201)

        except json.JSONDecodeError:

            return JsonResponse({
                "error": "El JSON enviado no es valido"
            }, status=400)

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)
