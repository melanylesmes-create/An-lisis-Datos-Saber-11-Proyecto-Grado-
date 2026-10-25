import { useState } from "react";
import InicioSesion from "./pages/InicioSesion";
import CargarDatosPage from "./pages/CargarDatosPage";

function App() {
  // Controla qué página se muestra
  const [sesionIniciada, setSesionIniciada] = useState(false);

  return (
    <>
      {sesionIniciada ? (
        <CargarDatosPage />
      ) : (
        <InicioSesion
          onLoginExitoso={() => setSesionIniciada(true)}
        />
      )}
    </>
  );
}

export default App;