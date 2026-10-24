# Definir las rutas del módulo.


from django.urls import path
from .views import exportar_pdf_view

urlpatterns = [
    path("pdf/", exportar_pdf_view, name="exportar_pdf"),
]
