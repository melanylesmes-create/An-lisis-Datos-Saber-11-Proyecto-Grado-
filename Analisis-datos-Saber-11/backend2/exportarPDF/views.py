from django.shortcuts import render

# Consultar los resultados y generar la respuesta para descargar el PDF.


from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET

from .crear_pdf import generar_pdf


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
