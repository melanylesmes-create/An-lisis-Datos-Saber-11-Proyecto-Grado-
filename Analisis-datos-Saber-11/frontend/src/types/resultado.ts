// Representa un registro procesado por nuestro ETL
export interface ResultadoSaber11 {
  codigo_icfes: string;
  nombre_institucion: string;
  ciudad: string;
  anio: number;
  periodo: number;
  lectura_critica: number | null;
  matematicas: number | null;
  ciencias_sociales: number | null;
  ciencias_naturales: number | null;
  ingles: number | null;
  codigo_dane: string | null;
  estado_dane: string;
}

// Representa un error encontrado durante la validación
export interface ErrorETL {
  fila: number;
  campo: string;
  mensaje: string;
}

// Representa el diagnóstico del archivo
export interface DiagnosticoETL {
  total_registros: number;
  total_columnas: number;
  columnas: string[];
  valores_nulos: Record<string, number>;
  tipos_datos: Record<string, string>;
  filas_duplicadas: number;
}

// Representa la respuesta de Django
export interface RespuestaETL {
  mensaje: string;
  diagnostico: DiagnosticoETL;
  errores: ErrorETL[];
  total_errores: number;
  registros: ResultadoSaber11[];
  guardado: boolean;
}