#se realiza loq ue necesita que se haga en mi 
#aplicación.

from .entidades import Usuario

class Autenticacion:
    #Inicializa usuarios
    def __init__(self, usuarios):
        self.usuarios = usuarios


    def buscar_usuario(self, documento):
        #recorre los objetos usuaruios que tengo guardado
        #en sel.usuarios
        for usuario in self.usuarios:
            if usuario.documento == documento:
                return usuario
            return None


    def verificar_credenciales(self, usuario, contrasena):
        if usuario is None:
            return False
        return usuario.contrasena == contrasena


    def verificar_rol (self, usuario):
        if usuario is None:
            return None


    def iniciar_sesion(self, documento, contrasena):
        usuario = self.buscar_usuario(documento)
        if usuario is None:
            return None
        if not self.verificar_credenciales(usuario, contrasena):
            return None

        return usuario
    