import { useState } from "react"
import Encabezado from "./components/Encabezado"
import Navegacion from "./components/Navegacion"
import Inicio from "./pages/Inicio"
import Analisis from "./pages/Analisis"
import "./styles/General.css"

function App() {

    // Guarda qué página está viendo actualmente el usuario.
    // Al iniciar la plataforma mostramos "inicio".
    const [pagina, setPagina] = useState("inicio")

    return (
        <>
            {/* Encabezado institucional */}
            <Encabezado />

            {/* 
                Enviamos setPagina a Navegacion.
                Así el menú puede cambiar la página que queremos mostrar.
            */}
            <Navegacion setPagina={setPagina} />

            {/* Si la página seleccionada es inicio, mostramos Inicio */}
            {pagina === "inicio" && <Inicio />}

            {/* Si selecciona análisis, mostramos Analisis */}
            {pagina === "analisis" && <Analisis />}
        </>
    )
}

export default App