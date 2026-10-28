
// las propiedades que recibe el componente
interface MenuProps {

  // Indica cuál sección está seleccionada actualmente.
  // Solo permite estos tres valores.
  seccionActiva: "resultados" | "simulacros" | "perfil";
  // Función que se ejecuta cuando el usuario selecciona
  // una opción del menú.
  // Recibe el nombre de la sección seleccionada.
  onSeleccionar: (
    seccion: "resultados" | "simulacros" | "perfil"
  ) => void;

  // Función que se ejecutará al pulsar "Cerrar sesión".
  // No recibe parámetros y no devuelve ningún valor.
  onCerrarSesion: () => void;
}


// 2. Creamos y exportamos el componente de React
export default function Menu({seccionActiva,onSeleccionar,onCerrarSesion,}: MenuProps) {

  // 3. Definimos las opciones del menú.
  // Cada opción tiene un identificador y un nombre.
  const opciones = [
    {
      id: "resultados",
      nombre: "Resultados Saber 11",
    },
    {
      id: "simulacros",
      nombre: "Simulacros",
    },
    {
      id: "perfil",
      nombre: "Mi perfil",
    },
  ] as const;

  // "as const" permite conservar los valores exactos
  // de los identificadores en TypeScript.


  // 4. Retornamos los elementos visuales del menú
  return (

    // <aside> representa contenido complementario.
    // Aquí lo utilizamos para construir la barra lateral.
    <aside
  className="
    w-full
    border-b border-[#E1E8F0]
    bg-white
    p-5
    lg:sticky
    lg:top-0
    lg:h-screen
    lg:w-64
    lg:shrink-0
    lg:border-b-0
    lg:border-r
    lg:overflow-y-auto
  "
>

      {/* 5. Título del menú */}
      <h2 className=" mb-5  text-xs font-bold  uppercase tracking-wider text-[#94A3B8]" >
        Menú principal
      </h2>


      {/* 6. Contenedor de las opciones de navegación */}
      <nav
        aria-label="Navegación principal"
        className="space-y-2"
      >

        {/* Recorremos las opciones utilizando map() */}
        {opciones.map((opcion) => (

          // Creamos un botón por cada opción.
          <button

            // React utiliza key para identificar
            // cada elemento generado por map().
            key={opcion.id}

            // Evita que el botón envíe formularios.
            type="button"

            // Al hacer clic, avisamos al componente padre
            // cuál opción seleccionó el usuario.
            onClick={() => onSeleccionar(opcion.id)}

            // Identifica la página activa
            // para tecnologías de asistencia.
            aria-current={
              seccionActiva === opcion.id
                ? "page"
                : undefined
            }

            // Aplicamos estilos según la opción seleccionada.
            className={`
              w-full
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              font-medium
              transition-colors

              ${
                // Comparamos la sección activa con la opción.
                seccionActiva === opcion.id

                  // Si está seleccionada:
                  // fondo azul pastel y texto azul institucional.
                  ? "bg-[#EAF1FF] text-[#3366CC]"

                  // Si NO está seleccionada:
                  // texto gris y efecto al pasar el mouse.
                  : "text-[#667085] hover:bg-[#F4F6F9]"
              }
            `}
          >

            {/* Mostramos el nombre de la opción */}
            {opcion.nombre}

          </button>
        ))}

      </nav>


      {/* 7. Sección para cerrar sesión */}
      <div
        className="
          mt-8
          border-t border-[#E1E8F0]
          pt-5
        "
      >

        {/* Botón de cierre de sesión */}
        <button

          type="button"

          // Ejecuta la función que recibimos del padre.
          // La lógica real de cierre de sesión
          // se implementará al conectar el menú.
          onClick={onCerrarSesion}

          className="
            w-full
            rounded-xl
            px-4
            py-3
            text-left
            text-sm
            font-medium
            text-red-600
            transition-colors
            hover:bg-red-50
          "
        >
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}
