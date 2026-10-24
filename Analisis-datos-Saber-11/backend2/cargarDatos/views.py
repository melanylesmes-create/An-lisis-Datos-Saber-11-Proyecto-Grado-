
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .servicios import ejecutar_etl
import pandas as pd


# Recibe el archivo desde React y ejecuta el ETL.
@require_POST
def subir_archivo_view(request):

    # 1. Recibir el archivo enviado desde el frontend.
    archivo = request.FILES.get("archivo")

    if not archivo:
        return JsonResponse({
            "error": "Debes seleccionar un archivo."
        }, status=400)

    # 2. Comprobar la extensión del archivo.
    extension = archivo.name.rsplit(".", 1)[-1].lower()

    if extension not in ("csv", "xlsx"):
        return JsonResponse({
            "error": "Solo se permiten archivos CSV o XLSX."
        }, status=400)

    # 3. Ejecutar el ETL desde servicios.py.
    try:
        resultado = ejecutar_etl(archivo, extension)

        # Recuperamos los resultados del procesamiento.
        datos = resultado["datos"]
        diagnostico = resultado["diagnostico"]
        errores = resultado["errores"]

        # 4. Convertir el DataFrame en una lista de registros.
        # Pandas utiliza NaN para valores faltantes,
        # pero JSON necesita recibir null.
        datos_json = datos.astype(object).where(
            pd.notna(datos), None
        ).to_dict(orient="records")

        # 5. Devolver la información a React.
        return JsonResponse({
            "mensaje": "Archivo procesado correctamente.",
            "diagnostico": diagnostico,
            "errores": errores,
            "total_errores": len(errores),
            "registros": datos_json,
            "guardado": False
        }, status=200)

    except (ValueError, pd.errors.ParserError) as error:
        return JsonResponse({
            "error": str(error)
        }, status=400)
