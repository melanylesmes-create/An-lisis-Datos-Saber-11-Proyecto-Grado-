##Simulador web 
#estructura

backend/
│
├── config/
│   ├── db.js                 # Conexión a la base de datos PostgreSQL/MySQL
│   └── jwt.js                # Configuración de JWT para autenticación
│
├── controllers/              # Lógica de entrada/salida y estado HTTP
│   ├── authController.js     # Registro, inicio de sesión (Estudiante, Docente, Admin, Funcionario)
│   ├── userController.js     # Gestión CRUD de usuarios (Administrador)
│   ├── questionController.js # Gestión CRUD de preguntas y opciones (Funcionario)
│   ├── examController.js     # Generación de simulacros y recepción de respuestas (Estudiante)
│   └── reportController.js   # Consulta de resultados y fallos (Docente y Estudiante)
│
├── middlewares/              # Validaciones y protección de rutas
│   ├── authMiddleware.js     # Verificación de Token JWT
│   └── roleMiddleware.js     # Control de acceso según rol (Ej: Funcionario, Docente)
│
├── models/                   # Definición de tablas / ORM (Sequelize, TypeORM o consultas SQL)
│   ├── User.js               # Tablas: Usuario, Estudiante, Docente, Funcionario
│   ├── Question.js           # Tablas: Pregunta, Respuesta_correcta, Respuesta_incorrecta, Banco
│   ├── Subject.js            # Tablas: Materia, Modalidad
│   ├── Exam.js               # Tabla: Simulacro_Saber_11
│   └── Result.js             # Tabla: Resultados_simulacro_saber_11 y Resultados_reales
│
├── routes/                   # Rutas de la API REST
│   ├── authRoutes.js         # POST /api/auth/login, POST /api/auth/register
│   ├── userRoutes.js         # GET, POST, PUT, DELETE /api/users
│   ├── questionRoutes.js     # GET, POST, PUT, DELETE /api/questions
│   ├── examRoutes.js         # POST /api/exams/start, POST /api/exams/submit
│   └── reportRoutes.js       # GET /api/reports/results, GET /api/reports/failed-questions
│
├── services/                 # Lógica de negocio pesada
│   ├── scoringService.js     # Cálculo del puntaje global y por áreas (Lectura, Mates, etc.)
│   └── analyticsService.js   # Generación de reportes de preguntas falladas
│
├── .env                      # Variables de entorno (PORT, DB_URI, JWT_SECRET)
├── app.js                    # Configuración de Express y Middlewares globales
└── server.js                 # Punto de entrada de la aplicación


frontend/src/
├── componentes/
│   ├── Banner.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Navbar.jsx
│   └── QuestionsPanel.jsx
└── pages/
    ├── Analisis.jsx         # Vista para Docentes
    ├── Inicio.jsx           # Landing / Dashboard general
    ├── Login.jsx            # Autenticación y control de acceso
    ├── Mision.jsx           # Información institucional
    ├── Pruebas.jsx          # Interfaz de simulacro para Estudiantes
    ├── Resultados.jsx       # Visualización de puntajes
    ├── AdminUsuarios.jsx    # CRUD Usuarios (Administrador)
    └── GestionBanco.jsx     # CRUD Preguntas (Funcionario)
