
import type { ResultadoSaber11 } from "../types/resultado";

// Importa los componentes de las gráficas existentes
import GraficasResultados from "./GraficaDeBarras";
import GraficaMapaCalor from "./GraficaMapaCalor";

// Define los registros que recibe el panel
interface PanelGraficasProps {
  registros: ResultadoSaber11[];
}

// Agrupa las gráficas en una sola sección
export default function PanelGraficas({
  registros,
}: PanelGraficasProps) {
  return (
    <section>
      {/* Muestra la gráfica de promedios por área */}
      <GraficasResultados registros={registros} />

      {/* Muestra el mapa de calor por institución y área */}
      <GraficaMapaCalor registros={registros} />
    </section>
  );
}
