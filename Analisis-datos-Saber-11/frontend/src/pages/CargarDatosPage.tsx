

import SubirArchivo from "../components/SubirArchivo";
import TablaResultados from "../components/TablaResultados";

import type { RespuestaETL } from "../types/resultado";

// Propiedades que recibimos desde App.tsx
interface CargarDatosPageProps {
  resultado: RespuestaETL | null;
  cargando: boolean;
  error: string | null;
  subirArchivo: (archivo: File) => Promise<void>;
  onVerGraficas: () => void;
}

export default function CargarDatosPage({
  resultado,
  cargando,
  error,
  subirArchivo,
  onVerGraficas,
}: CargarDatosPageProps) {

  return (
    <div className="min-h-screen bg-[#F4F6F9]">


      <div className="mx-auto max-w-6xl px-6 py-10">

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

        {/* Componente para subir archivos */}
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
            Aquí se muestran los resultados procesados
            de las instituciones educativas de Popayán.
          </p>

          <div className="mt-6">

            {resultado ? (
              <TablaResultados registros={resultado.registros} />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-400">
                  Aún no se ha procesado ningún archivo.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Botón para continuar a las gráficas */}
        {resultado && resultado.registros.length > 0 && (
          <div className="mt-8 flex justify-end">

            <button
              type="button"
              onClick={onVerGraficas}
              className="rounded-lg bg-[#3366CC] px-8 py-3
                         font-semibold text-white shadow-sm
                         transition hover:bg-[#254E9E]"
            >
              Siguiente: Visualizar gráficas →
            </button>

          </div>
        )}

        {/* Información del procesamiento temporal */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Los archivos se procesan temporalmente.
          No se almacenan en la base de datos.
        </p>

      </div>
    </div>
  );
}
