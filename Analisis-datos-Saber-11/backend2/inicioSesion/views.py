from django.shortcuts import render
# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, Rol
  
@csrf_exempt
def login_view(request):
 
    # POST -> validar credenciales (Create de la sesion)
    if request.method == "POST":
        correo = request.POST.get("correo")
        contrasena = request.POST.get("contrasena")
 
        try:
            usuario = Usuario.objects.get(correo=correo, contrasena=contrasena)
        except Usuario.DoesNotExist:
            return JsonResponse({"error": "Correo o contrasena incorrectos"}, status=401)
 
        return JsonResponse({
            "mensaje": "Login exitoso",
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "rol": usuario.id_rol.nombre_rol,
        })
 
    # GET -> listar usuarios de prueba (Read), util para copiar un id_usuario real
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
 
    # PUT/PATCH -> actualizar contrasena de un usuario (Update)
    if request.method in ("PUT", "PATCH"):
        correo = request.GET.get("correo")
        nueva_contrasena = request.GET.get("contrasena")
 
        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)
 
        if nueva_contrasena:
            usuario.contrasena = nueva_contrasena
            usuario.save()
 
        return JsonResponse({"mensaje": f"Usuario {usuario.nombre} actualizado"})
 
    # DELETE -> eliminar usuario de prueba (Delete)
    if request.method == "DELETE":
        correo = request.GET.get("correo")
 
        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)
 
        usuario.delete()
        return JsonResponse({"mensaje": "Usuario eliminado"})
 
    return JsonResponse({"error": "Metodo no soportado"}, status=405)
 
 
@csrf_exempt
def crear_usuario_prueba_view(request):
    """Endpoint aparte solo para SEMBRAR datos de prueba rapido (POST)."""
    if request.method != "POST":
        return JsonResponse({"error": "Metodo no soportado"}, status=405)

    nombre_rol = request.POST.get("rol", "funcionario")
    rol, _ = Rol.objects.get_or_create(nombre_rol=nombre_rol)
 
    usuario = Usuario.objects.create(
        id_rol=rol,
        tipo_identificacion=request.POST.get("tipo_identificacion", "CC"),
        numero_identificacion=request.POST.get("numero_identificacion"),
        nombre=request.POST.get("nombre"),
        apellido=request.POST.get("apellido"),
        contrasena=request.POST.get("contrasena"),
        correo=request.POST.get("correo"),
    )
 
    return JsonResponse({
        "mensaje": "Usuario de prueba creado",
        "id_usuario": usuario.id_usuario,
    }, status=201)