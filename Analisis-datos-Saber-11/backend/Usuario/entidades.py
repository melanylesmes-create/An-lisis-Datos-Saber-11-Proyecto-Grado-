#Clases Usuario, Administrador, Funcionario

class Usuario:
    #self inicializar atributos
    def __init__(self,idUsuario , tipoDocumento,documento,
                 nombre, apellido, correo, contrasena, rol):
        self.idUsuario = idUsuario
        self.tipoDocumento = tipoDocumento
        self.documento = documento
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.contrasena = contrasena
        self.rol = rol

# def es definir una funcion o metodo y to_dict es convertir a diccionario
#sirve para tomar los atributos de un objeto y devolverlos organizados
    def to_dict(self):
        return{
            "idUsuario": self.idUsuario,
            "tipoDocumento": self.tipoDocumento,
            "documento" : self.documento,
            "nombre" : self.nombre,
            "apellido" : self.apellido,
            "correo" : self.correo,
            "rol" : self.rol
        }

class Administrador (Usuario):
    def __init__(self, idUsuario, tipoDocumento, documento,
                 nombre, apellido, correo, contrasena):
        super().__init__(
            idUsuario,
            tipoDocumento,
            documento,
            nombre,
            apellido,
            correo,
            contrasena,
            "Administrador"
        )

class Funcionario(Usuario):
    def __init__(self, idUsuario, tipoDocumento, documento,
                nombre, apellido, correo, contrasena,):
        #Ejecutar el constructor __init__ de la clase padre
        super().__init__(
            idUsuario,
            tipoDocumento,
            documento,
            nombre,
            apellido,
            correo,
            contrasena,
            "Funcionario"
        )