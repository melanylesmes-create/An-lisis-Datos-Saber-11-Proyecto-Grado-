export type Rol = "funcionario" | "administrador";

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  rol: Rol;
}
