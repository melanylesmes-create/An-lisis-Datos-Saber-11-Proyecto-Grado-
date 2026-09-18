from django.db import models

# Create your models here.

# resultados/models.py
from django.db import models
from subirArchivos.models import CargaArchivo
from instituciones.models import InstitucionEducativa


class ResultadoRealSaber11(models.Model):
    id_resultado_real = models.AutoField(primary_key=True)
    id_carga = models.ForeignKey(
        CargaArchivo, on_delete=models.CASCADE,
        db_column="id_carga", related_name="resultados"
    )
    id_institucion = models.ForeignKey(
        InstitucionEducativa, on_delete=models.PROTECT, db_column="id_institucion"
    )
    anio = models.IntegerField()
    puntaje_global = models.IntegerField(null=True, blank=True)
    lectura_critica = models.IntegerField(null=True, blank=True)
    matematicas = models.IntegerField(null=True, blank=True)
    sociales_ciudadanas = models.IntegerField(null=True, blank=True)
    ciencias_naturales = models.IntegerField(null=True, blank=True)
    ingles = models.CharField(max_length=5, null=True, blank=True)  # nivel: A1, A2, B1...

    class Meta:
        db_table = "resultado_reales_saber_11"

    def __str__(self):
        return f"Resultado {self.anio} - carga {self.id_carga_id}"