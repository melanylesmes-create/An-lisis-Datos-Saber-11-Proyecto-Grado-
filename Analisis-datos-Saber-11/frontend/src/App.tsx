
import { useState } from "react";
import InicioSesion from "./pages/InicioSesion";
import CargarDatosPage from "./pages/CargarDatosPage";
import VisualizarGraficasPage from "./pages/VisualizarGraficasPage";

import { useSubirArchivo } from "./hooks/useSubirArchivo";

function App() {

  // Controla si el usuario inició sesión
  const [sesionIniciada, setSesionIniciada] = useState(false);

  // Controla la página que estamos visualizando
  const [paginaActual, setPaginaActual] = useState<
    "cargar" | "graficas"
  >("cargar");

  // Compartimos los resultados del ETL entre las páginas
  const {
    resultado,
    cargando,
    error,
    subirArchivo
  } = useSubirArchivo();

  // Si no ha iniciado sesión, mostramos el login
  if (!sesionIniciada) {
    return (
      <InicioSesion
        onLoginExitoso={() => setSesionIniciada(true)}
      />
    );
  }

  // Página para visualizar las gráficas
  if (paginaActual === "graficas") {
    return (
      <VisualizarGraficasPage
        registros={resultado?.registros ?? []}
        onVolver={() => setPaginaActual("cargar")}
      />
    );
  }

  // Página para cargar y procesar el archivo
  return (
    <CargarDatosPage
      resultado={resultado}
      cargando={cargando}
      error={error}
      subirArchivo={subirArchivo}
      onVerGraficas={() => setPaginaActual("graficas")}
    />
  );
}

export default App;
