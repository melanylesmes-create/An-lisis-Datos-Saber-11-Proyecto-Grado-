import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import SubirArchivo from "../components/SubirArchivo";
import { useSubirArchivo } from "../hooks/useSubirArchivo";

export default function CargarDatosPage() {

  // Custom Hook para administrar el ETL
  const {
    resultado,
    cargando,
    error,
    subirArchivo
  } = useSubirArchivo();

  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Encabezado institucional */}
      <EncabezadoInstitucional />

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Título del módulo */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-[#172B4D]">
            Análisis de resultados Saber 11
          </h2>

          <p className="mt-2 text-gray-500">
            Carga y análisis de información académica
            de las instituciones educativas de Popayán.
          </p>
        </section>

        {/* Componente de carga mediante Props */}
        <SubirArchivo
          onSubirArchivo={subirArchivo}
          cargando={cargando}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Registros procesados
            </p>

            <p className="mt-2 text-3xl font-bold text-[#3366CC]">
              {resultado ? resultado.registros.length : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Errores detectados
            </p>

            <p className="mt-2 text-3xl font-bold text-[#3366CC]">
              {resultado ? resultado.total_errores : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Estado del procesamiento
            </p>

            <p className="mt-2 text-lg font-semibold text-[#3366CC]">
              {cargando
                ? "Procesando..."
                : resultado
                  ? "Completado"
                  : "Pendiente"}
            </p>
          </div>

        </section>

        {/* Vista previa de resultados */}
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="text-xl font-semibold text-[#172B4D]">
            Vista previa de resultados
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Aquí se mostrarán los resultados procesados
            de las instituciones educativas de Popayán.
          </p>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">

            {resultado ? (
              <p className="text-gray-600">
                Se encontraron {resultado.registros.length} registros.
              </p>
            ) : (
              <p className="text-gray-400">
                Aún no se ha procesado ningún archivo.
              </p>
            )}

          </div>

        </section>

        {/* Información del procesamiento temporal */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Los archivos se procesan temporalmente.
          No se almacenan en la base de datos.
        </p>

      </main>
    </div>
  );
}