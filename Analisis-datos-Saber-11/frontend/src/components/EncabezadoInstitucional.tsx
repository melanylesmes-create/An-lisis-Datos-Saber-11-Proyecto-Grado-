
import logoAlcaldia from "../assets/logo-alcaldia.png";

export default function EncabezadoInstitucional() {
  return (

    <header>
      {/* Barra superior GOV.CO */}
      <div className="bg-[#3366CC] text-white">
        <div className="mx-auto max-w-6xl px-6 py-2">
          <span className="text-base font-medium">
            GOV.CO
          </span>
        </div>
      </div>

      {/* Identificación institucional */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">

          {/* Escudo de la Alcaldía */}
          <img
            src={logoAlcaldia}
            alt="Escudo de la Alcaldía de Popayán"
            className="h-16 w-auto object-contain"
          />

          {/* Línea separadora */}
          <div className="h-15 w-px bg-gray-300"></div>

          {/* Nombre institucional */}
          <div>
            <p className="text-sm text-gray-500">
              ALCALDÍA DE POPAYÁN
            </p>

            <h1 className="mt-1 text-xl font-bold text-[#102A5E]">
              Secretaría de Educación
            </h1>
          </div>

        </div>
      </div>
    </header>
  );
}
