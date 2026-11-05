from django.shortcuts import render
# Create your views here.
import json
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from .models import Usuario, Rol
from .permisos import (
    ROLES_ADMIN,
    obtener_usuario_sesion,
    roles_requeridos,
    serializar_usuario,
)


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

            # EX02 Campos incompletos
            if not numero_identificacion or not contrasena:
                return JsonResponse({
                    "error": "Complete todos los campos"
                }, status=400)

            # Busca el usuario en PostgreSQL
            usuario = Usuario.objects.select_related("id_rol").get(
                numero_identificacion=numero_identificacion,
                contrasena=contrasena
            )

            # Verifica que sea funcionario o administrador
            if not usuario.es_funcionario() and not usuario.es_admin():
                return JsonResponse({
                    "error": "Usuario sin permiso para ingresar"
                }, status=403)

            # Guarda el usuario en la sesión para proteger los demás endpoints.
            request.session.cycle_key()
            request.session["usuario_id"] = usuario.id_usuario
            request.session["rol"] = usuario.id_rol.nombre_rol
            request.session.modified = True

            # Inicio de sesión
            return JsonResponse({
                "mensaje": "Inicio de sesión exitoso!",
                "usuario": serializar_usuario(usuario),
            })

            # EX01 datos incorrectos
        except Usuario.DoesNotExist:
            return JsonResponse({
                "error": "Numero de identificación o contraseña incorrecta"
            }, status=401)

        # Si el JSON esta mal escrito
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "El JSON enviado no es valido"
            }, status=401)

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)


@csrf_exempt
def cerrar_sesion_Post(request):
    # POST -> elimina la sesión actual
    if request.method == "POST":
        request.session.flush()
        return JsonResponse({"mensaje": "Sesión cerrada correctamente."})

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)


@require_GET
def sesion_actual_Get(request):
    # GET -> devuelve el usuario autenticado para restaurar la sesión.
    usuario = obtener_usuario_sesion(request)

    if usuario is None:
        return JsonResponse({"autenticado": False}, status=401)

    return JsonResponse({
        "autenticado": True,
        "usuario": serializar_usuario(usuario),
    })


@csrf_exempt
@roles_requeridos(*ROLES_ADMIN)
def mostrar_usuario_Get(request):
    # GET -> lista los usuarios (solo administrador)
    if request.method == "GET":
        usuarios = Usuario.objects.select_related("id_rol").all()
        data = [serializar_usuario(u) for u in usuarios]
        return JsonResponse({"usuarios": data}, safe=False)

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)


@csrf_exempt
@roles_requeridos(*ROLES_ADMIN)
def crear_usuario_Post(request):
    # POST -> registra un usuario (solo administrador)
    if request.method == "POST":
        try:
            # Lee el JSON enviado desde Postman o el frontend
            datos = json.loads(request.body)
            # Obtiene el rol enviado
            nombre_rol = datos.get("rol")
            if nombre_rol == "funcionario" or nombre_rol == "administrador":
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

            if not datos.get("contrasena"):
                return JsonResponse({
                    "error": "contrasena es obligatoria"
                }, status=400)

            if not datos.get("correo"):
                return JsonResponse({
                    "error": "correo es obligatorio"
                }, status=400)

            # Guarda el usuario en PostgreSQL
            usuario = Usuario.objects.create(
                id_rol=rol,
                tipo_identificacion=datos.get("tipo_identificacion", "C.C"),
                numero_identificacion=datos.get("numero_identificacion"),
                nombre=datos.get("nombre"),
                apellido=datos.get("apellido", ""),
                contrasena=datos.get("contrasena"),
                correo=datos.get("correo")
            )

            return JsonResponse({
                "mensaje": "Usuario creado correctamente",
                "usuario": serializar_usuario(usuario),
            }, status=201)

        except Rol.DoesNotExist:
            return JsonResponse({
                "error": "El rol ingresado no existe"
            }, status=400)

        except IntegrityError:
            return JsonResponse({
                "error": "La identificación o el correo ya están registrados"
            }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({
                "error": "El JSON enviado no es valido"
            }, status=400)

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)


@csrf_exempt
@roles_requeridos(*ROLES_ADMIN)
def editar_usuario_Put(request, id_usuario):
    # PUT -> actualiza un usuario existente (solo administrador)
    if request.method in ("PUT", "PATCH"):
        try:
            usuario = Usuario.objects.select_related("id_rol").get(
                id_usuario=id_usuario
            )
            datos = json.loads(request.body)

            if "rol" in datos:
                nombre_rol = datos.get("rol")
                if nombre_rol not in ("funcionario", "administrador"):
                    return JsonResponse({
                        "error": "El rol ingresado no es válido"
                    }, status=400)
                usuario.id_rol = Rol.objects.get(nombre_rol=nombre_rol)

            campos = [
                "tipo_identificacion",
                "numero_identificacion",
                "nombre",
                "apellido",
                "correo",
            ]

            for campo in campos:
                if campo in datos:
                    setattr(usuario, campo, datos[campo])

            # La contraseña solo se cambia si se envía un valor.
            if datos.get("contrasena"):
                usuario.contrasena = datos.get("contrasena")

            usuario.save()

            return JsonResponse({
                "mensaje": "Usuario actualizado correctamente",
                "usuario": serializar_usuario(usuario),
            })

        except Usuario.DoesNotExist:
            return JsonResponse({
                "error": "El usuario no existe"
            }, status=404)

        except Rol.DoesNotExist:
            return JsonResponse({
                "error": "El rol ingresado no existe"
            }, status=400)

        except IntegrityError:
            return JsonResponse({
                "error": "La identificación o el correo ya están registrados"
            }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({
                "error": "El JSON enviado no es valido"
            }, status=400)

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)


@csrf_exempt
@roles_requeridos(*ROLES_ADMIN)
def eliminar_usuario_Delete(request, id_usuario):
    # DELETE -> elimina un usuario (solo administrador)
    if request.method == "DELETE":
        if request.usuario.id_usuario == id_usuario:
            return JsonResponse({
                "error": "No puedes eliminar tu propio usuario"
            }, status=400)

        try:
            usuario = Usuario.objects.get(id_usuario=id_usuario)
        except Usuario.DoesNotExist:
            return JsonResponse({
                "error": "El usuario no existe"
            }, status=404)

        usuario.delete()

        return JsonResponse({"mensaje": "Usuario eliminado correctamente"})

    return JsonResponse({
        "error": "Metodo no permitido"
    }, status=405)
