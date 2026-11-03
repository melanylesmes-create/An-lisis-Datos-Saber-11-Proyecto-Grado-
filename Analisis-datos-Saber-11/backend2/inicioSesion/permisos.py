from functools import wraps

from django.http import JsonResponse

from .models import Usuario

# Roles disponibles en la plataforma.
ROL_ADMINISTRADOR = "administrador"
ROL_FUNCIONARIO = "funcionario"

# Permisos por caso de uso.
# CU03 (cargar, validar y procesar) -> funcionario.
ROLES_CARGA = (ROL_FUNCIONARIO,)
# CU04 (consultar, indicadores, dashboards e informes) -> funcionario.
ROLES_CONSULTA = (ROL_FUNCIONARIO,)
# CU02 (gestionar usuarios) -> administrador.
ROLES_ADMIN = (ROL_ADMINISTRADOR,)


def obtener_usuario_sesion(request):
    """Devuelve el usuario asociado a la sesión actual o None."""
    usuario_id = request.session.get("usuario_id")

    if not usuario_id:
        return None

    try:
        return Usuario.objects.select_related("id_rol").get(
            id_usuario=usuario_id
        )
    except Usuario.DoesNotExist:
        return None


def roles_requeridos(*roles):
    """Restringe una vista a los roles indicados usando la sesión Django."""

    def decorador(vista):
        @wraps(vista)
        def envoltura(request, *args, **kwargs):
            usuario = obtener_usuario_sesion(request)

            if usuario is None:
                return JsonResponse(
                    {"error": "Debes iniciar sesión."},
                    status=401,
                )

            if roles and usuario.id_rol.nombre_rol not in roles:
                return JsonResponse(
                    {"error": "No tienes permiso para realizar esta acción."},
                    status=403,
                )

            request.usuario = usuario
            return vista(request, *args, **kwargs)

        return envoltura

    return decorador


def serializar_usuario(usuario):
    return {
        "id_usuario": usuario.id_usuario,
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "correo": usuario.correo,
        "tipo_identificacion": usuario.tipo_identificacion,
        "numero_identificacion": usuario.numero_identificacion,
        "rol": usuario.id_rol.nombre_rol,
    }
