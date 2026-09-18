from django.db import models
# Create your models here.

# App TEMPORAL solo para tener usuarios reales en Postgres y poder
# probar el endpoint de carga de archivos. Cuando el equipo de login
# entregue la version definitiva,
 
from instituciones.models import InstitucionEducativa

class Rol(models.Model):

    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)
 
    class Meta:
        db_table = "rol"
 
    def __str__(self):
        return self.nombre_rol
 
 
class Usuario(models.Model):

    id_usuario = models.AutoField(primary_key=True)
    id_rol = models.ForeignKey(Rol, on_delete=models.PROTECT, db_column="id_rol")

    id_institucion = models.ForeignKey(
        InstitucionEducativa, on_delete=models.PROTECT,
        db_column="id_institucion", null=True, blank=True
    )
    
    tipo_identificacion = models.CharField(max_length=20, default="CC")
    numero_identificacion = models.CharField(max_length=30, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    contrasena = models.CharField(max_length=128)
    correo = models.EmailField(unique=True)
 
    class Meta:
        db_table = "usuario"
 
    def es_admin(self):
        return self.id_rol.nombre_rol == "administrador"
 
    def es_funcionario(self):
        return self.id_rol.nombre_rol == "funcionario"
 
    def __str__(self):
        return f"{self.nombre} {self.apellido}"
 