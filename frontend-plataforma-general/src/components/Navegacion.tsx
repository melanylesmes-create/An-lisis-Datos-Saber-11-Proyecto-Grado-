// Importamos los estilos de la navegación
import "../styles/Navegacion.css"
// Indicamos que Navegacion recibirá una función llamada setPagina
interface NavegacionProps {
    setPagina: (pagina: string) => void
}

function Navegacion({ setPagina }: NavegacionProps) {

    return (
        <nav className="navegacion">

            {/* Cambia la página a Inicio */}
            <button onClick={() => setPagina("inicio")}>
                Inicio
            </button>

            <button>
                Simulacro web
            </button>

            {/* Cambia la página a Análisis */}
            <button onClick={() => setPagina("analisis")}>
                Análisis de datos
            </button>

            <button>
                Acerca de nosotros
            </button>

        </nav>
    )
}

export default Navegacion