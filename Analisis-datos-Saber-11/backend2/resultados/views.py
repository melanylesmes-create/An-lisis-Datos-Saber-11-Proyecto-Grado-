
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST

from .models import ResultadoRealSaber11
from .graficas import (
    grafica_promedio_areas,
    grafica_comparacion_instituciones,
    grafica_ranking_instituciones,
    grafica_mapa_calor_instituciones,
    grafica_circular_areas,
    grafica_evolucion_anual,
    grafica_caja_bigotes,
)


@require_GET
def mostrar_resultados_view(request):
    # Consulta los resultados guardados y devuelve los campos necesarios.
    resultados = ResultadoRealSaber11.objects.select_related(
        "id_institucion"
    ).all()

    datos = []

    for resultado in resultados:
        institucion = resultado.id_institucion

        datos.append({
            "id_resultado_real": resultado.id_resultado_real,
            "codigo_icfes": institucion.codigo_dane,
            "codigo_dane": institucion.codigo_dane,
            "nombre_institucion": institucion.nombre,
            "ciudad": institucion.municipio,
            "estado_dane": (
                "Falta código DANE"
                if not institucion.codigo_dane
                else "Pendiente de verificar"
            ),
            "anio": resultado.anio,
            "periodo": resultado.periodo,
            "puntaje_global": resultado.puntaje_global,
            "lectura_critica": resultado.lectura_critica,
            "matematicas": resultado.matematicas,
            "ciencias_sociales": resultado.sociales_ciudadanas,
            "ciencias_naturales": resultado.ciencias_naturales,
            "ingles": resultado.ingles,
        })

    return JsonResponse({"resultados": datos})


def responder_grafica(funcion, datos, area=None):
    # Ejecuta la función gráfica y devuelve el PNG o un mensaje de error.
    try:
        imagen = funcion(datos, area) if area is not None else funcion(datos)
        return HttpResponse(imagen, content_type="image/png")
    except (ValueError, TypeError, KeyError) as error:
        return JsonResponse({"error": str(error)}, status=400)
    except Exception:
        # Evita enviar detalles internos del servidor al navegador.
        return JsonResponse(
            {"error": "Ocurrió un error al generar la gráfica."},
            status=500,
        )


def obtener_registros(request):
    # Lee y valida los registros enviados desde React.
    try:
        cuerpo = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise ValueError("El cuerpo de la solicitud no contiene JSON válido.")

    registros = cuerpo.get("registros")

    if not isinstance(registros, list) or not registros:
        raise ValueError("Debes enviar una lista de registros no vacía.")

    return registros, cuerpo.get("area")


def procesar_grafica(request, funcion, necesita_area=False):
    # Centraliza la lectura de datos y la generación de las gráficas.
    try:
        registros, area = obtener_registros(request)

        if necesita_area and not area:
            return JsonResponse(
                {"error": "Debes seleccionar un área."},
                status=400,
            )

        return responder_grafica(funcion, registros, area if necesita_area else None)

    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)


@require_POST
def generar_grafica_areas(request):
    # Genera la gráfica de promedios por área.
    return procesar_grafica(request, grafica_promedio_areas)


@require_POST
def generar_grafica_comparacion(request):
    # Genera la comparación de instituciones para el área seleccionada.
    return procesar_grafica(
        request, grafica_comparacion_instituciones, necesita_area=True
    )


@require_POST
def generar_grafica_ranking(request):
    # Genera el ranking de instituciones para el área seleccionada.
    return procesar_grafica(
        request, grafica_ranking_instituciones, necesita_area=True
    )


@require_POST
def generar_grafica_mapa_calor(request):
    # Genera el mapa de calor de promedios institucionales.
    return procesar_grafica(request, grafica_mapa_calor_instituciones)


@require_POST
def generar_grafica_circular(request):
    # Genera la gráfica circular de promedios por área.
    return procesar_grafica(request, grafica_circular_areas)


@require_POST
def generar_grafica_evolucion(request):
    # Genera la evolución anual para el área seleccionada.
    return procesar_grafica(
        request, grafica_evolucion_anual, necesita_area=True
    )


@require_POST
def generar_grafica_caja_bigotes(request):
    # Genera el diagrama de caja y bigotes para el área seleccionada.
    return procesar_grafica(
        request, grafica_caja_bigotes, necesita_area=True
    )
