from django.shortcuts import render

# Create your views here.
# resultados/views.py
from django.http import JsonResponse
from .models import ResultadoRealSaber11


def mostrar_resultados_view(request):
    if request.method != "GET":
        return JsonResponse({"error": "Metodo no soportado"}, status=405)

    # select_related trae tambien los datos de institucion y carga
    # en la MISMA consulta, para no hacer una consulta extra por cada fila.
    resultados = ResultadoRealSaber11.objects.select_related(
        "id_institucion", "id_carga"
    ).all()

    data = [
        {
            "id_resultado_real": r.id_resultado_real,
            "anio": r.anio,
            "puntaje_global": r.puntaje_global,
            "lectura_critica": r.lectura_critica,
            "matematicas": r.matematicas,
            "sociales_ciudadanas": r.sociales_ciudadanas,
            "ciencias_naturales": r.ciencias_naturales,
            "ingles": r.ingles,
            "institucion": r.id_institucion.nombre,
            "municipio": r.id_institucion.municipio,
            "archivo_origen": r.id_carga.nombre_archivo,
        }
        for r in resultados
    ]

    return JsonResponse({"resultados": data}, safe=False)