import React, { useState } from 'react'
import "../styles/InicioSesion.css"

interface InicioSesionProps {
  onLoginExitoso: () => void;
}

export default function InicioSesion({onLoginExitoso}:InicioSesionProps) {
    // Guarda la identificación escrita por el usuario
    const [identificacion, setIdentificacion] = useState("")
    // Guarda la contraseña escrita por el usuario
    const [contrasena, setContrasena] = useState("")

        // Envía los datos del inicio de sesión al backend
    // Envía las credenciales a Django
    const iniciarSesion = async () => {
    try {
        const respuesta = await fetch(
        "http://localhost:8000/api/iniciar/",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            numero_identificacion: identificacion.trim(),
            contrasena: contrasena,
            }),
        }
        );

        // Convertimos la respuesta de Django a JSON
        const datos = await respuesta.json();

        console.log(datos);

        // Verificamos si Django aceptó las credenciales
        if (respuesta.ok) {
        onLoginExitoso();
        } else {
        alert(datos.error || datos.mensaje || "Identificación o contraseña incorrecta.");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("No fue posible conectar con el servidor.");
    }
    };

  return (
    <>
    <div className="pagina-login">

            {/* Franja superior institucional */}
            <div className="barra-gov">
                GOV.CO
            </div>

            {/* Encabezado */}
            <header className="encabezado">
                <div className="institucion">
                    <span>ALCALDÍA DE POPAYÁN</span>
                    <strong>SECRETARÍA DE EDUCACIÓN</strong>
                </div>

                <a href="#">← Volver al inicio</a>
            </header>

            {/* Contenido principal */}
            <main className="contenido-login">

                <div className="tarjeta-login">

                    {/*Acooooordarrrrmeeee de colooooocaarrr icooonoooo*/}
                    <div className="icono-login"> :D </div>

                    <h1>Acceso al módulo</h1>

                    <p>
                        Ingresa con tu número de identificación para acceder
                        al módulo de análisis de datos de los resultados Saber 11.
                    </p>

                    <div className="campo">
                        <label>Identificación</label>
                        <input type="text" placeholder="identificación" value={identificacion} 
                                onChange={(e) => setIdentificacion(e.target.value)}/>
                    </div>

                    <div className="campo">
                        <label>Contraseña</label>
                        <input type="password" placeholder="contraseña" value={contrasena}
                        // Actualiza la contraseña mientras escribimos
                                onChange={(e) => setContrasena(e.target.value)}/>
                    </div>

                    <button className="boton-login" onClick={iniciarSesion}>
                        Iniciar sesión
                    </button>

                </div>

            </main>

        </div>
    </>
  );
}
