from django.shortcuts import render

import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .procesarDatos import calcular_promedios
from .ollamaService import analizar_resultados


@require_POST
def analizar_resultados_view(request):
    try:
        # Recibimos los registros enviados desde React
        datos = json.loads(request.body)
        registros = datos.get("registros", [])

        # Verificamos que existan registros
        if not isinstance(registros, list) or not registros:
            return JsonResponse(
                {"error": "No hay registros para analizar."},
                status=400
            )

        #Se manda a Calcular promedios
        resultado = calcular_promedios(registros)

        if not resultado["promedios"]:
            return JsonResponse(
                {"error": "No se encontraron puntajes válidos."},
                status=400
            )

        interpretacion = analizar_resultados(resultado)

        return JsonResponse({
            "promedios": resultado["promedios"],
            "area_mayor": resultado["area_mayor"],
            "area_menor": resultado["area_menor"],
            "interpretacion": interpretacion
        })

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse(
            {"error": "Los datos enviados no son válidos."},
            status=400
        )

    except Exception:
        return JsonResponse(
            {"error": "No se pudo generar el análisis con Ollama."},
            status=500
        )
