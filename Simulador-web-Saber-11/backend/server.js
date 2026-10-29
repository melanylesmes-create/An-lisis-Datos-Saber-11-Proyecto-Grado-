


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Conexión con Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Rutas existentes
const usuariosRoutes = require("./routes/usuarios.routes");
const preguntasRoutes = require("./routes/preguntas.routes");
const simulacroRoutes = require("./routes/simulacro.routes");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/simulacro", simulacroRoutes);

// Comprobar que el backend funciona
app.get("/", (req, res) => {
  res.send("Backend del Simulador Saber 11 funcionando");
});

// Generar preguntas con Groq.
// Se conservan ambas rutas para no romper el frontend existente.
app.post(
  ["/api/groq/preguntas", "/api/gemini/preguntas"],
  async (req, res) => {
    try {
      const { area, tema, cantidad } = req.body;

      if (
        typeof area !== "string" ||
        !area.trim() ||
        typeof tema !== "string" ||
        !tema.trim()
      ) {
        return res.status(400).json({
          error: "Debes indicar el área y el tema.",
        });
      }

      const numero = Math.min(
        10,
        Math.max(1, Number(cantidad) || 3)
      );

      const prompt = `
Actúa como especialista en evaluación educativa para estudiantes
de grado 11 en Colombia que se preparan para las pruebas Saber 11.

Genera exactamente ${numero} preguntas originales de selección
múltiple sobre el área "${area.trim()}" y el tema "${tema.trim()}".

Requisitos:
- Redacta las preguntas en español.
- Evalúa comprensión, análisis y aplicación de conocimientos.
- Incluye cuatro opciones por pregunta: A, B, C y D.
- Solo una opción debe ser correcta.
- La explicación debe justificar brevemente la respuesta correcta.
- Evita preguntas ambiguas y opciones repetidas.

Devuelve un objeto JSON con esta estructura:
{
  "preguntas": [
    {
      "enunciado": "Texto de la pregunta",
      "opciones": {
        "A": "Opción A",
        "B": "Opción B",
        "C": "Opción C",
        "D": "Opción D"
      },
      "respuestaCorrecta": "A",
      "explicacion": "Explicación de la respuesta"
    }
  ]
}

La propiedad respuestaCorrecta debe contener únicamente A, B, C o D.
`;

      const resultado = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_object",
        },
        temperature: 0.7,
      });

      const contenido =
        resultado.choices?.[0]?.message?.content;

      if (!contenido) {
        throw new Error("Groq no devolvió contenido.");
      }

      const datos = JSON.parse(contenido);

      if (
        !Array.isArray(datos.preguntas) ||
        datos.preguntas.length !== numero
      ) {
        throw new Error(
          "La respuesta de Groq no contiene la cantidad esperada de preguntas."
        );
      }

      res.json(datos);
    } catch (error) {
      console.error("Error al generar preguntas con Groq:", error);

      res.status(500).json({
        error:
          error.message ||
          "No se pudieron generar las preguntas con Groq.",
      });
    }
  }
);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});