import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Laboratorio de Renderizado en Next.js
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-3">
            Explorador de Estrategias CSR vs SSR
          </h1>
          <p className="text-slate-400 text-base md:text-lg mt-2">
            Proyecto que demuestra el uso práctico de Server-Side Rendering y Client-Side Rendering con PokeAPI, Open-Meteo y OMDb API.
          </p>
        </div>

        {/* Big Featured Card for Actividad Integradora */}
        <Link
          href="/movies"
          className="group p-8 bg-gradient-to-r from-purple-900/60 via-slate-900 to-cyan-950/60 rounded-3xl border-2 border-purple-500/40 hover:border-cyan-400 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/20 block text-left relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              ⭐ Actividad Integradora Principal
            </span>
            <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition">
              Abrir App →
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white group-hover:text-cyan-300 transition">
            🍿 Galería de Películas y Series (OMDb)
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Catálogo de películas populares renderizadas en el servidor (SSR) + buscador interactivo con filtros y modal emergente de detalles completos (CSR).
          </p>
        </Link>

        {/* Previous Exercises */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link
            href="/pokemon-csr"
            className="p-5 bg-slate-900 hover:bg-slate-800/80 rounded-2xl font-bold border border-blue-500/30 hover:border-blue-400 text-center block transition shadow-lg"
          >
            🎮 Pokémon CSR
            <span className="block text-xs font-normal text-blue-300 mt-1">
              Client-Side Rendering (PokeAPI)
            </span>
          </Link>

          <Link
            href="/pokemon-ssr"
            className="p-5 bg-slate-900 hover:bg-slate-800/80 rounded-2xl font-bold border border-emerald-500/30 hover:border-emerald-400 text-center block transition shadow-lg"
          >
            ⚡ Pokémon SSR
            <span className="block text-xs font-normal text-emerald-300 mt-1">
              Server-Side Rendering (PokeAPI)
            </span>
          </Link>

          <Link
            href="/weather"
            className="p-5 bg-slate-900 hover:bg-slate-800/80 rounded-2xl font-bold border border-sky-500/30 hover:border-sky-400 text-center block transition shadow-lg"
          >
            ☁️ Clima Híbrido
            <span className="block text-xs font-normal text-sky-300 mt-1">
              Lima (SSR) + Mundo (CSR)
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
