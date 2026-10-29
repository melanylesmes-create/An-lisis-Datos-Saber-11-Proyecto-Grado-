export default function Simulador() {
  const irSimulador = () => {
    // Redirige al frontend del simulador que corre en su propio puerto
    window.location.href = "http://localhost:5173/";
  };

  return (
    <main className="contenido">
      <h1>Simulador Saber 11</h1>
      <p>
        Accede al simulador web para practicar las pruebas Saber 11.
      </p>
      <button onClick={irSimulador}>
        Ingresar al módulo
      </button>
    </main>
  );
}

