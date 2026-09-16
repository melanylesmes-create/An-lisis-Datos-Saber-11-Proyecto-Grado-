from django.db import models
# Create your models here.

class InstitucionEducativa(models.Model):
    
    id_institucion = models.AutoField(primary_key=True)
    codigo_dane = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=200)
    tipo_institucion = models.CharField(max_length=50)
    direccion = models.CharField(max_length=200)
    municipio = models.CharField(max_length=100)
    zona = models.CharField(max_length=50)
 
    class Meta:
        db_table = "institucion_educativa"
 
    def __str__(self):
        return self.nombre