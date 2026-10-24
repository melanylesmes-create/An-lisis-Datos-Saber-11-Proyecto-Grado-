from django.shortcuts import render
# Create your views here.
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, Rol
  
@csrf_exempt
def login_view_Post(request):
    # POST -> validar credenciales (Create de la sesion)
    if request.method == "POST":
        try:
            # Convierte el JSON recibido a datos de Python
            datos = json.loads(request.body)
            # Obtiene numero identificacion y contraseña del JSON
            numero_identificacion = datos.get("numero_identificacion")
            contrasena = datos.get("contrasena")

            #EX02 Campos incompletos
            if not numero_identificacion or not contrasena:
                return JsonResponse({
                    "error" : "Complete todos los campos"
                }, status = 400)

            #Buca el usuario en PostgreSQL
            usuario = Usuario.objects.get(
                numero_identificacion = numero_identificacion,
                contrasena= contrasena
            )

            #verifica que sea funcionario o administrador
            if not usuario.es_funcionario() and not usuario.es_admin():
                return JsonResponse({
                    "error" : "Usuario sin permiso para ingresar"
                }, status = 403)

            #Inicio de sesión 
            return JsonResponse({
                "mensaje" : "Inicio de sesión exitoso!",
                "Bienvenido/a" : usuario.id_usuario,
                "rol" : usuario.id_rol.nombre_rol
            })
        
            #EX01 datos incorrectos
        except Usuario.DoesNotExist:
            return JsonResponse({
                "error" : "Numero de identificación o contraseña incorrecta"
            }, status = 401)

        #Si el JSON esta mal escrito
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "El JSON enviado no es valido"
            }, status=401)
 
@csrf_exempt
def mostrar_usuario_Get (request):

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
def crear_usuario_Post(request):

    #POST
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
                numero_identificacion=datos.get("numero_identificacion" ),
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
