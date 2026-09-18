from django.shortcuts import render
# Create your views here.
import pandas as pd

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CargaArchivo
from resultados.models import ResultadoRealSaber11
from instituciones.models import InstitucionEducativa
 
 
@csrf_exempt
def subir_archivo_view(request):

    #POST
    if request.method != "POST":
        return JsonResponse({"error": "Metodo no soportado, usa POST"}, status=405)

    #Recibir archivo
    archivo = request.FILES.get("archivo")

    if not archivo:
        return JsonResponse({"error": "No se envio ningun archivo (campo 'archivo')"}, status=400)

    #Recibir o anotar el usuario que hace la carga 
    id_usuario = request.POST.get("id_usuario")
    if not id_usuario:
        return JsonResponse({"error": "Falta id_usuario (quien esta subiendo el archivo)"}, status=400)

    #Obtener la extenesion 
    extension = archivo.name.split(".")[-1].lower()

    if extension not in ("csv", "xlsx"):
        return JsonResponse({"error": "No es CSV o Excel (.xlsx)"}, status=400)

    #Leer archivo con pandas
    try:
        if extension == "csv":
            df = pd.read_csv(archivo)
        else:
            df = pd.read_excel(archivo)
    except Exception as e:
        return JsonResponse({
            "error": f"No se pudo leer el archivo: {e}"
        }, status=400)

 
    # Registrar el usuario que realizo una carga
    carga = CargaArchivo.objects.create(
        id_usuario_id=id_usuario,
        nombre_archivo=archivo.name,
        tipo_archivo=extension,
        estado_importacion="procesado",
    )
 
    # Recorrer las filas
    filas_guardadas = 0
    errores = []
 
    for i, fila in df.iterrows():
        try:
            # Busca la institucion por codigo_dane, o la crea si no existe
            institucion = InstitucionEducativa.objects.get(
                codigo_dane=str(fila.get("codigo_dane"))
            )

            # Obtener año
            referencia = str(fila.get("referencia", ""))

            if referencia:
                anio = int(referencia.split("-")[0])
            else:
                anio = None

            #Guardar resultado en POSTGRESQL
            ResultadoRealSaber11.objects.create(
                id_carga=carga,
                id_institucion=institucion,
                anio=anio,
                puntaje_global=fila.get("puntaje_global"),
                lectura_critica=fila.get("lectura_critica"),
                matematicas=fila.get("matematicas"),
                sociales_ciudadanas=fila.get("ciencias_sociales"),
                ciencias_naturales=fila.get("ciencias_naturales"),
                ingles=fila.get("ingles_nivel"),
            )
            filas_guardadas += 1
        except Exception as e:
            errores.append(f"Fila {i + 2}: {e}")  # +2 por el encabezado y el indice 0
 
    if not errores:
        carga.estado_importacion = "procesado"
    else:
        carga.estado_importacion = "error"
    carga.save()
 
    return JsonResponse({
        "mensaje": "Archivo procesado",
        "carga_id": carga.id_carga,
        "filas_guardadas": filas_guardadas,
        "errores": errores,
    }, status=201)
