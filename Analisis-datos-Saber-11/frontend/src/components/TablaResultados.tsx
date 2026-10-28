
import { useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";

// Propiedades que recibe el componente
interface TablaResultadosProps {
  registros: ResultadoSaber11[];
}

// Cantidad de registros que mostraremos por página
const REGISTROS_POR_PAGINA = 10;

export default function TablaResultados({
  registros,
}: TablaResultadosProps) {

  // Controla la página que está visualizando el usuario
  const [paginaActual, setPaginaActual] = useState(1);

  // Calculamos cuántas páginas necesitamos
  const totalPaginas = Math.ceil(
    registros.length / REGISTROS_POR_PAGINA
  );

  // Calculamos desde qué registro debemos mostrar
  const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;

  // Obtenemos únicamente los registros de la página actual
  const registrosVisibles = registros.slice(
    inicio,
    inicio + REGISTROS_POR_PAGINA
  );

  // Muestra un guion cuando no existe puntaje
  const mostrarPuntaje = (valor: number | null) => {
    return valor ?? "—";
  };

  // Si no hay registros, mostramos un mensaje
  if (registros.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay registros para mostrar.
      </p>
    );
  }

  return (
    <div className="space-y-4">

      {/* Permite desplazarse horizontalmente si hay muchas columnas */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">

        <table className="min-w-full text-sm text-left">

          {/* Encabezados de la tabla */}
          <thead className="bg-blue-50 text-blue-950">
            <tr>
              <th className="px-4 py-3">Código ICFES</th>
              <th className="px-4 py-3">Institución educativa</th>
              <th className="px-4 py-3">Año</th>
              <th className="px-4 py-3">Periodo</th>
              <th className="px-4 py-3">Lectura crítica</th>
              <th className="px-4 py-3">Matemáticas</th>
              <th className="px-4 py-3">Sociales</th>
              <th className="px-4 py-3">Naturales</th>
              <th className="px-4 py-3">Inglés</th>
              <th className="px-4 py-3">Estado DANE</th>
            </tr>
          </thead>

          {/* Registros enviados desde Django */}
          <tbody className="divide-y divide-gray-200">

            {registrosVisibles.map((registro, indice) => (
              <tr
                key={`${registro.codigo_icfes}-${registro.anio}-${registro.periodo}-${inicio + indice}`}
                className="hover:bg-blue-50/50"
              >
                <td className="px-4 py-3">
                  {registro.codigo_icfes}
                </td>

                <td className="px-4 py-3 font-medium">
                  {registro.nombre_institucion}
                </td>

                <td className="px-4 py-3">
                  {registro.anio}
                </td>

                <td className="px-4 py-3">
                  {registro.periodo}
                </td>

                <td className="px-4 py-3">
                  {mostrarPuntaje(registro.lectura_critica)}
                </td>

                <td className="px-4 py-3">
                  {mostrarPuntaje(registro.matematicas)}
                </td>

                <td className="px-4 py-3">
                  {mostrarPuntaje(registro.ciencias_sociales)}
                </td>

                <td className="px-4 py-3">
                  {mostrarPuntaje(registro.ciencias_naturales)}
                </td>

                <td className="px-4 py-3">
                  {mostrarPuntaje(registro.ingles)}
                </td>

                <td className="px-4 py-3">
                  {registro.estado_dane}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center justify-between gap-4">

        <p className="text-sm text-gray-500">
          Mostrando {inicio + 1} a{" "}
          {Math.min(inicio + REGISTROS_POR_PAGINA, registros.length)}
          {" "}de {registros.length} registros
        </p>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
            disabled={paginaActual === 1}
            className="rounded-md border px-3 py-2 disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-600">
            {paginaActual} de {totalPaginas}
          </span>

          <button
            type="button"
            onClick={() =>
              setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))
            }
            disabled={paginaActual === totalPaginas}
            className="rounded-md border px-3 py-2 disabled:opacity-40"
          >
            Siguiente
          </button>

        </div>
      </div>
    </div>
  );
}
