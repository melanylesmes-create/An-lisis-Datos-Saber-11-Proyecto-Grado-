function Analisis() {

    // Esta función se ejecutará cuando el usuario
    // presione el botón para entrar al módulo.
    const irAnalisis = () => {

        // Cambia la página actual por la dirección
        // donde está ejecutándose el frontend
        // del módulo de análisis de datos.
        window.location.href = "http://localhost:5175/"
    }

    return (
        <main className="contenido">

            <h1>Análisis de datos Saber 11</h1>

            <p>
                Consulta y analiza información relacionada con
                los resultados de las pruebas Saber 11.
            </p>

            <button onClick={irAnalisis}>
                Ingresar al módulo
            </button>

        </main>
    )
}

export default Analisis