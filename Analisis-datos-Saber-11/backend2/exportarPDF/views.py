
import json
from io import BytesIO

from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST

# Función creada por tu compañera para generar PDF
from .crear_pdf import generar_pdf

# Reutilizamos las gráficas de nuestro módulo resultados
from resultados.graficas import (
    grafica_promedio_areas,
    grafica_comparacion_instituciones,
    grafica_ranking_instituciones,
)



@require_GET
def exportar_pdf_view(request):
    # Obtener filtros opcionales desde la URL
    anio = request.GET.get("anio")
    periodo = request.GET.get("periodo")
    institucion = request.GET.get("institucion")

    filtros = {}

    if anio:
        filtros["Año"] = anio

    if periodo:
        filtros["Periodo"] = periodo

    if institucion:
        filtros["Institución"] = institucion

    try:
        # Generar el documento PDF
        pdf = generar_pdf(filtros=filtros)

        respuesta = HttpResponse(
            pdf.getvalue(),
            content_type="application/pdf",
        )

        respuesta["Content-Disposition"] = (
            'attachment; filename="informe_saber11.pdf"'
        )

        return respuesta

    except Exception as error:
        return JsonResponse(
            {
                "error": "No fue posible generar el informe PDF.",
                "detalle": str(error),
            },
            status=500,
        )

    
@require_POST
def exportar_pdf_completo_view(request):
    try:
        # Recibimos los registros enviados desde React
        datos = json.loads(request.body)

        registros = datos.get("registros", [])
        area = datos.get("area", "matematicas")

        if not isinstance(registros, list) or not registros:
            return JsonResponse(
                {"error": "No hay registros para generar el informe."},
                status=400
            )

        # Reutilizamos las gráficas de Matplotlib
        imagen_areas = BytesIO(
            grafica_promedio_areas(registros)
        )

        imagen_comparacion = BytesIO(
            grafica_comparacion_instituciones(registros, area)
        )

        imagen_ranking = BytesIO(
            grafica_ranking_instituciones(registros, area)
        )

        # Construimos el PDF con la plantilla existente
        pdf = generar_pdf(
            filtros={
                "Registros analizados": len(registros),
                "Área de comparación": area,
            },
            graficos=[
                {
                    "titulo": "Promedios por área",
                    "imagen": imagen_areas,
                },
                {
                    "titulo": "Comparación entre instituciones",
                    "imagen": imagen_comparacion,
                },
                {
                    "titulo": "Ranking de instituciones",
                    "imagen": imagen_ranking,
                },
            ],
            fuentes=[
                "Resultados Saber 11 - ICFES"
            ],
        )

        respuesta = HttpResponse(
            pdf.getvalue(),
            content_type="application/pdf"
        )

        respuesta["Content-Disposition"] = (
            'attachment; filename="Informe_Completo_Saber11.pdf"'
        )

        return respuesta

    except (ValueError, KeyError, TypeError) as error:
        return JsonResponse(
            {"error": str(error)},
            status=400
        )

