# Definir las rutas del módulo.

from django.urls import path

from .views import (
    exportar_pdf_view,
    exportar_pdf_completo_view,
)

urlpatterns = [
    # PDF original de tu compañera
    path(
        "pdf/",
        exportar_pdf_view,
        name="exportar_pdf"
    ),

    # PDF completo con las tres gráficas
    path(
        "pdf-completo/",
        exportar_pdf_completo_view,
        name="exportar_pdf_completo"
    ),
]
