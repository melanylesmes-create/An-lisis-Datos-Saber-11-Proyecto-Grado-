// Importamos el encabezado
import Encabezado from "./components/Encabezado"

// Importamos la página de inicio
import Inicio from "./pages/Inicio"
import Navegacion from "./components/Navegacion"
// Importamos los estilos generales
import "./styles/General.css"


function App() {

    return (
        <>
            {/* Encabezado de la plataforma */}
            <Encabezado />

            {/* Menú principal */}
            <Navegacion />

            {/* Contenido de la página principal */}
            <Inicio />
        </>
    )
}

export default App