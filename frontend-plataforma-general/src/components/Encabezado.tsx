// Importamos los estilos del encabezado
import "../styles/Encabezado.css"

function Encabezado() {

    return (
        <header>

            {/* Barra azul superior de GOV.CO */}
            <div className="barra-gov">
                GOV.CO
            </div>

            {/* Encabezado con la información institucional */}
            <div className="encabezado">

                {/* Nombre de la institución */}
                <div className="institucion">
                    <span>ALCALDÍA DE POPAYÁN</span>
                    <strong>SECRETARÍA DE EDUCACIÓN</strong>
                </div>

            </div>

        </header>
    )
}

export default Encabezado