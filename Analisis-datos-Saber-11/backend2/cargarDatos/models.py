from django.db import models
# Create your models here.
# subirArchivo/models.py
from inicioSesion.models import Usuario


class CargaArchivo(models.Model):
    
    id_carga = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, db_column="id_usuario")
    nombre_archivo = models.CharField(max_length=255)
    tipo_archivo = models.CharField(max_length=10)  # "csv" o "xlsx"
    estado_importacion = models.CharField(max_length=20, default="pendiente")

    class Meta:
        db_table = "archivo"

    def __str__(self):
        return self.nombre_archivo