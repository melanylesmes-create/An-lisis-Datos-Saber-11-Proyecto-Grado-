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
        <div className="mx-auto max-w-6xl px-6 py-7">
          <p className="text-base text-black">
            ALCALDÍA DE POPAYÁN
          </p>

          <h1 className="mt-1 text-2xl font-bold text-black">
            SECRETARÍA DE EDUCACIÓN
          </h1>
        </div>
      </div>
    </header>
  );
}