
export default function IconoSeguridad() {
  return (
    <div className="flex justify-center mb-5">
      {/*fLEX h-15 y w-15 es para el tamaño del circulo :D*/}
      <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#EAF1FF]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3366CC"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      </div>
    </div>
  );
}
