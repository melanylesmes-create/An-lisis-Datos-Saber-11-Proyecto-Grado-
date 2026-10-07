// Importamos el archivo que contiene los estilos del encabezado
import "../styles/Encabezado.css"

// Creamos el componente Encabezado
export default function Encabezado() {

    return (
        <header className="encabezado">

            {/* Barra azul superior */}
            <div className="barra-gov">
                GOV.CO
            </div>

            {/* Información de la entidad */}
            <div className="encabezado-contenido">

                <div>
                    <p>ALCALDÍA DE POPAYÁN</p>
                    <h2>SECRETARÍA DE EDUCACIÓN</h2>
                </div>

            </div>

        </header>
    )
}