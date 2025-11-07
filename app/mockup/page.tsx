export default function MobileEnrollmentMockup() {
  return (
    <div className="min-h-screen w-full bg-[#0b203c] text-white flex items-center justify-center p-3">
      {/* Phone canvas */}
      <div className="w-full max-w-[420px] h-[760px] rounded-3xl bg-white text-[#0B1F3A] shadow-xl relative overflow-hidden">
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF7A00] via-[#FF9F40] to-[#FF7A00]" />
        <div className="p-4 pb-0">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FF7A00]" />
              <h1 className="text-base font-semibold">Inscripción Express</h1>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0B1F3A] text-white/90">
              Mobile
            </span>
          </header>
        </div>

        {/* Content: keep everything on a single screen */}
        <main className="px-4 pt-3 pb-4 h-full flex flex-col">
          {/* Compact form & summary card */}
          <section className="rounded-2xl border border-[#0B1F3A]/10 bg-white shadow-sm p-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Nombre */}
              <label className="col-span-1 text-[11px] font-medium">
                Nombre
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="mt-1 w-full h-8 rounded-xl border border-[#0B1F3A]/15 px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/60"
                />
              </label>
              {/* Apellido */}
              <label className="col-span-1 text-[11px] font-medium">
                Apellido
                <input
                  type="text"
                  placeholder="Tu apellido"
                  className="mt-1 w-full h-8 rounded-xl border border-[#0B1F3A]/15 px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/60"
                />
              </label>

              {/* Carrera */}
              <label className="col-span-2 text-[11px] font-medium">
                Carrera
                <select
                  className="mt-1 w-full h-8 rounded-xl border border-[#0B1F3A]/15 px-3 text-[12px] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/60"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona tu programa
                  </option>
                  <option>Lic. en Administración</option>
                  <option>Ingeniería en Sistemas</option>
                  <option>Marketing Digital</option>
                  <option>Psicología</option>
                </select>
              </label>

              {/* Fecha de inicio */}
              <label className="col-span-2 text-[11px] font-medium">
                Fecha de inicio
                <input
                  type="date"
                  className="mt-1 w-full h-8 rounded-xl border border-[#0B1F3A]/15 px-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/60"
                />
              </label>
            </div>

            {/* Summary mini-card */}
            <div className="mt-3 rounded-xl border border-[#0B1F3A]/10 bg-[#0B1F3A] text-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold">
                  Resumen del programa
                </p>
                <span className="text-[10px] bg-white/10 rounded-md px-2 py-0.5">
                  2 min
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-white/90 line-clamp-3">
                Programa orientado a resultados, con módulos prácticos, mentoría
                semanal y proyectos aplicados. Duración flexible y evaluaciones
                continuas para impulsar tu empleabilidad.
              </p>
              <button className="mt-2 w-full h-8 rounded-lg bg-white text-[#0B1F3A] text-[11px] font-semibold hover:opacity-90">
                Ver temario rápido
              </button>
            </div>
          </section>

          {/* Payment pills */}
          <section className="mt-3">
            <h2 className="sr-only">Opciones de pago</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Básico", price: "$499 MXN" },
                { label: "Estándar", price: "$799 MXN" },
                { label: "Pro", price: "$1,199 MXN" },
                { label: "Full", price: "$1,499 MXN" },
                { label: "Premium", price: "$1,999 MXN" },
              ].map((plan, idx) => (
                <button
                  key={plan.label}
                  className={
                    "flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition " +
                    (idx === 2
                      ? "col-span-2 border-[#FF7A00] bg-[#FF7A00] text-white shadow-md"
                      : "border-[#0B1F3A]/15 bg-white text-[#0B1F3A]")
                  }
                >
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-semibold">
                      {plan.label}
                    </span>
                    <span className="text-[10px] opacity-70">
                      Inscripción inmediata
                    </span>
                  </div>
                  <span className="text-[13px] font-bold">{plan.price}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Sticky CTA */}
          <div className="mt-3">
            <button className="w-full h-11 rounded-2xl bg-[#FF7A00] text-white text-sm font-bold shadow hover:brightness-95">
              Confirmar datos y pagar
            </button>
            <p className="text-center text-[10px] text-[#0B1F3A]/70 mt-1">
              Al continuar aceptas los términos y el aviso de privacidad.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
