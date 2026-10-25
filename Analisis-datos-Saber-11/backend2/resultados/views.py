
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST

from .models import ResultadoRealSaber11
from .graficas import (grafica_promedio_areas, grafica_comparacion_instituciones,grafica_ranking_instituciones,)


# Consulta los resultados guardados en PostgreSQL
@require_GET
def mostrar_resultados_view(request):

    # Obtenemos resultados, instituciones y cargas
    # en una misma consulta para mejorar el rendimiento
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

    return JsonResponse({"resultados": data})


# Genera una gráfica a partir de los datos del ETL
@require_POST
def generar_grafica_areas(request):

    try:
        # Recibimos los registros enviados desde React
        contenido = json.loads(request.body)
        registros = contenido.get("registros", [])

        # Validamos que existan registros
        if not isinstance(registros, list) or not registros:
            return JsonResponse({
                "error": "No hay registros para generar la gráfica."
            }, status=400)

        # Generamos la imagen utilizando Pandas y Matplotlib
        imagen = grafica_promedio_areas(registros)

        # Enviamos la gráfica PNG a React
        return HttpResponse(
            imagen,
            content_type="image/png"
        )

    except (ValueError, TypeError, KeyError) as error:
        return JsonResponse({
            "error": str(error)
        }, status=400)

    
@require_POST
def generar_grafica_comparacion(request):
    try:
        # Recibimos los datos enviados desde React
        datos = json.loads(request.body)

        registros = datos.get("registros", [])
        area = datos.get("area", "matematicas")

        # Validamos los registros
        if not isinstance(registros, list) or not registros:
            return JsonResponse(
                {"error": "No hay registros para comparar."},
                status=400
            )

        # Generamos la gráfica utilizando Matplotlib
        imagen = grafica_comparacion_instituciones(
            registros,
            area
        )

        # Devolvemos la imagen a React
        return HttpResponse(
            imagen,
            content_type="image/png"
        )

    except (ValueError, KeyError, TypeError) as error:
        return JsonResponse(
            {"error": str(error)},
            status=400
        )


# Generar ranking de instituciones por área
@require_POST
def generar_grafica_ranking(request):
    try:
        # Recibimos la información enviada desde React
        datos = json.loads(request.body)

        registros = datos.get("registros", [])
        area = datos.get("area", "matematicas")

        # Validamos que existan registros
        if not isinstance(registros, list) or not registros:
            return JsonResponse(
                {"error": "No hay registros para generar el ranking."},
                status=400
            )

        # Generamos el ranking utilizando Pandas y Matplotlib
        imagen = grafica_ranking_instituciones(
            registros,
            area
        )

        # Devolvemos la gráfica como imagen PNG
        return HttpResponse(
            imagen,
            content_type="image/png"
        )

    except (ValueError, KeyError, TypeError) as error:
        return JsonResponse(
            {"error": str(error)},
            status=400
        )
