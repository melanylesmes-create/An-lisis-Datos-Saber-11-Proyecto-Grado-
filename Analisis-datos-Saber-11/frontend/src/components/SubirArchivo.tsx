import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// Props que recibe el componente padre
interface SubirArchivoProps {
  onSubirArchivo: (archivo: File) => void;
  cargando: boolean;
}

export default function SubirArchivo({
  onSubirArchivo,
  cargando,
}: SubirArchivoProps) {

  // Guarda temporalmente el archivo seleccionado
  const [archivo, setArchivo] = useState<File | null>(null);

  // Referencia al input oculto
  const inputRef = useRef<HTMLInputElement>(null);

  // Abre el explorador de archivos
  const seleccionarArchivo = () => {
    inputRef.current?.click();
  };

  // Guarda el archivo seleccionado
  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    const seleccionado = e.target.files?.[0] ?? null;
    setArchivo(seleccionado);
  };

  // Envía el archivo al componente padre
  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!archivo || cargando) return;

    onSubirArchivo(archivo);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Encabezado del formulario */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#172B4D]">
          Cargar archivo de resultados
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Selecciona un archivo Excel o CSV con los resultados
          de las pruebas Saber 11.
        </p>
      </div>

      <form onSubmit={manejarEnvio} className="space-y-5">

        {/* Área de selección */}
        <div className="rounded-xl border-2 border-dashed border-[#A8C1F0] bg-[#F5F8FF] px-6 py-10 text-center">

          <div className="mb-4 text-5xl" aria-hidden="true">
            📄
          </div>

          <p className="font-medium text-gray-700">
            Selecciona el archivo que deseas procesar
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Formatos permitidos: .xlsx y .csv
          </p>

          {/* Input oculto */}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={manejarCambio}
            disabled={cargando}
            className="hidden"
            aria-label="Seleccionar archivo Excel o CSV"
          />

          <button
            type="button"
            onClick={seleccionarArchivo}
            disabled={cargando}
            className="mt-5 rounded-lg bg-[#3366CC] px-6 py-3 font-medium text-white transition hover:bg-[#254E9C] disabled:opacity-50"
          >
            Seleccionar archivo
          </button>
        </div>

        {/* Archivo seleccionado */}
        {archivo && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                Archivo seleccionado
              </p>

              <p className="truncate font-medium text-[#172B4D]">
                {archivo.name}
              </p>
            </div>

            <button
              type="button"
              disabled={cargando}
              onClick={() => {
                setArchivo(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Quitar
            </button>
          </div>
        )}

        {/* Botón de procesamiento */}
        <button
          type="submit"
          disabled={!archivo || cargando}
          className="w-full rounded-lg bg-[#3366CC] px-5 py-3 font-semibold text-white transition hover:bg-[#254E9C] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {cargando ? "Procesando archivo..." : "Procesar archivo"}
        </button>

      </form>
    </section>
  );
}