
import { useState } from "react";

// Páginas de la aplicación
import InicioSesion from "./pages/InicioSesion";
import CargarDatosPage from "./pages/CargarDatosPage";
import VisualizarGraficasPage from "./pages/VisualizarGraficasPage";

// Componentes compartidos
import EncabezadoInstitucional from "./components/EncabezadoInstitucional";
import MenuLateral from "./components/Menu";

// Hook para procesar archivos
import { useSubirArchivo } from "./hooks/useSubirArchivo";

// Secciones principales del menú
type SeccionMenu = "resultados" | "simulacros" | "perfil";

// Pantallas del módulo de resultados reales
type PaginaResultados = "cargar" | "graficas";

function App() {

  // Indica si el usuario ha iniciado sesión
  const [sesionIniciada, setSesionIniciada] = useState(false);

  // Guarda la sección seleccionada en el menú lateral
  const [seccionActiva, setSeccionActiva] =
    useState<SeccionMenu>("resultados");

  // Controla si mostramos la carga o las gráficas
  const [paginaActual, setPaginaActual] =
    useState<PaginaResultados>("cargar");

  // Datos y funciones del procesamiento ETL
  const {
    resultado,
    cargando,
    error,
    subirArchivo,
  } = useSubirArchivo();

  // Cambia la sección seleccionada
  const seleccionarSeccion = (seccion: SeccionMenu) => {
    setSeccionActiva(seccion);
  };

  // Regresa al inicio de sesión y reinicia la navegación
  const cerrarSesion = () => {
    setSesionIniciada(false);
    setSeccionActiva("resultados");
    setPaginaActual("cargar");
  };

  // Si no existe una sesión iniciada, mostramos el login
  if (!sesionIniciada) {
    return (
      <InicioSesion
        onLoginExitoso={() => setSesionIniciada(true)}
      />
    );
  }

  // Estructura principal de la plataforma
  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Encabezado institucional de ancho completo */}
      <EncabezadoInstitucional />

      {/* Distribución: menú lateral + contenido */}
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* Menú lateral */}
        <MenuLateral
          seccionActiva={seccionActiva}
          onSeleccionar={seleccionarSeccion}
          onCerrarSesion={cerrarSesion}
        />

        {/* Área donde se muestran las páginas */}
        <main className="min-w-0 flex-1">

          {/* Resultados reales Saber 11 */}
          {seccionActiva === "resultados" && (
            paginaActual === "graficas" ? (

              <VisualizarGraficasPage
                registros={resultado?.registros ?? []}
                onVolver={() => setPaginaActual("cargar")}
              />

            ) : (

              <CargarDatosPage
                resultado={resultado}
                cargando={cargando}
                error={error}
                subirArchivo={subirArchivo}
                onVerGraficas={() => setPaginaActual("graficas")}
              />

            )
          )}

          {/* Sección de simulacros */}
          {seccionActiva === "simulacros" && (
            <section className="m-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#102A5E]">
                Simulacros
              </h1>

              <p className="mt-3 text-gray-500">
                Aquí se integrará el módulo de simulacros Saber 11.
              </p>
            </section>
          )}

          {/* Sección de perfil */}
          {seccionActiva === "perfil" && (
            <section className="m-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#102A5E]">
                Mi perfil
              </h1>

              <p className="mt-3 text-gray-500">
                Aquí se mostrará la información del usuario.
              </p>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
