
import { useEffect, useState } from "react";

// Páginas de la aplicación
import InicioSesion from "./pages/InicioSesion";
import CargarDatosPage from "./pages/CargarDatosPage";
import VisualizarGraficasPage from "./pages/VisualizarGraficasPage";
import GestionUsuariosPage from "./pages/GestionUsuariosPage";

// Componentes compartidos
import EncabezadoInstitucional from "./components/EncabezadoInstitucional";
import MenuLateral from "./components/Menu";

// Hook para procesar archivos
import { useSubirArchivo } from "./hooks/useSubirArchivo";

// Tipos de navegación y usuario
import type { SeccionMenu } from "./types/navegacion";
import type { Usuario } from "./types/usuario";

// Pantallas del módulo de resultados reales
type PaginaResultados = "cargar" | "graficas";

// Sección inicial según el rol del usuario.
function seccionInicial(usuario: Usuario): SeccionMenu {
  return usuario.rol === "administrador" ? "usuarios" : "resultados";
}

function App() {

  // Usuario autenticado y su rol
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Indica si estamos comprobando la sesión al cargar la página
  const [verificandoSesion, setVerificandoSesion] = useState(true);

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

  // Al cargar la aplicación, restauramos la sesión desde Django.
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/sesion/",
          { credentials: "include" }
        );

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (datos.autenticado && datos.usuario) {
          const usuarioSesion = datos.usuario as Usuario;
          setUsuario(usuarioSesion);
          setSeccionActiva(seccionInicial(usuarioSesion));
        }
      } catch {
        // Si el backend no responde, se mantiene la pantalla de login.
      } finally {
        setVerificandoSesion(false);
      }
    };

    restaurarSesion();
  }, []);

  // Guarda el usuario cuando el login es exitoso.
  const iniciarSesion = (usuarioAutenticado: Usuario) => {
    setUsuario(usuarioAutenticado);
    setSeccionActiva(seccionInicial(usuarioAutenticado));
    setPaginaActual("cargar");
  };

  // Cambia la sección seleccionada
  const seleccionarSeccion = (seccion: SeccionMenu) => {
    setSeccionActiva(seccion);
  };

  // Cierra la sesión en Django y regresa al login.
  const cerrarSesion = async () => {
    try {
      await fetch("http://localhost:8000/api/cerrar/", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Aunque falle la petición, limpiamos el estado local.
    } finally {
      setUsuario(null);
      setSeccionActiva("resultados");
      setPaginaActual("cargar");
    }
  };

  // Mientras comprobamos la sesión mostramos un mensaje breve.
  if (verificandoSesion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
        <p className="text-gray-500">Comprobando sesión...</p>
      </div>
    );
  }

  // Si no existe una sesión iniciada, mostramos el login
  if (!usuario) {
    return <InicioSesion onLoginExitoso={iniciarSesion} />;
  }

  // Estructura principal de la plataforma
  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Encabezado institucional de ancho completo */}
      <EncabezadoInstitucional />

      {/* Distribución: menú lateral + contenido */}
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* Menú lateral filtrado según el rol */}
        <MenuLateral
          seccionActiva={seccionActiva}
          rol={usuario.rol}
          onSeleccionar={seleccionarSeccion}
          onCerrarSesion={cerrarSesion}
        />

        {/* Área donde se muestran las páginas */}
        <main className="min-w-0 flex-1">

          {/* Resultados reales Saber 11 (solo funcionario) */}
          {seccionActiva === "resultados" && usuario.rol === "funcionario" && (
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

          {/* Sección de simulacros (solo funcionario) */}
          {seccionActiva === "simulacros" && usuario.rol === "funcionario" && (
            <section className="m-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#102A5E]">
                Simulacros
              </h1>

              <p className="mt-3 text-gray-500">
                Aquí se integrará el módulo de simulacros Saber 11.
              </p>
            </section>
          )}

          {/* Gestión de usuarios (solo administrador) */}
          {seccionActiva === "usuarios" && usuario.rol === "administrador" && (
            <GestionUsuariosPage usuarioActual={usuario} />
          )}

          {/* Sección de perfil (ambos roles) */}
          {seccionActiva === "perfil" && (
            <section className="m-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-[#102A5E]">
                Mi perfil
              </h1>

              <p className="mt-3 text-gray-500">
                {usuario.nombre} {usuario.apellido}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Rol: {usuario.rol}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Correo: {usuario.correo}
              </p>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
