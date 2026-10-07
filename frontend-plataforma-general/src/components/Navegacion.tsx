// Importamos los estilos de la navegación
import "../styles/Navegacion.css"

// Creamos el componente Navegacion
export default function Navegacion() {

    return (
        <nav className="navegacion">

            {/* Enlaces principales de la plataforma */}
            <a href="#">Inicio</a>

            <a href="#">Simulacro web</a>

            <a href="#">Análisis de datos</a>

            <a href="#">Acerca de nosotros</a>

        </nav>
    )
}