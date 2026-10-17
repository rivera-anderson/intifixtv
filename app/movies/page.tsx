import axios from 'axios'
import Link from 'next/link'
import MovieExplorer, { OMDbShow } from './MovieExplorer'

const API_KEY = '668075d0'

// SSR: Fetch Severance directly from OMDb API
async function getHeroShow(): Promise<OMDbShow | null> {
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&t=severance&plot=full`
    )
    if (res.data.Response === 'True') {
      return res.data
    }
  } catch (err) {
    console.error('Error fetching hero show from OMDb:', err)
  }
  return null
}

// SSR: Fetch Featured row dynamically from OMDb API
async function getFeaturedShows(): Promise<OMDbShow[]> {
  const titles = ['severance', 'luck', 'for all mankind', 'ted lasso', 'prehistoric planet']
  try {
    const requests = titles.map(title =>
      axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
    )
    const responses = await Promise.all(requests)
    return responses
      .map(r => r.data)
      .filter((d: any) => d && d.Response === 'True')
  } catch (err) {
    console.error('Error fetching featured shows from OMDb:', err)
    return []
  }
}

export default async function MoviesPage() {
  const [heroShow, featuredShows] = await Promise.all([
    getHeroShow(),
    getFeaturedShows()
  ])

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-yellow-400 selection:text-black font-sans relative overflow-x-hidden">
      
      {/* 1. INTIFIX TV FLOATING TOP NAVIGATION PILL (z-30 para nunca tapar el modal) */}
      <header className="fixed top-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-black/75 backdrop-blur-2xl border border-white/15 shadow-2xl text-xs sm:text-sm font-medium text-white/70">
          <Link
            href="/movies"
            className="px-3 py-1 rounded-full text-white/90 hover:text-white transition"
          >
            Inicio
          </Link>

          <Link
            href="/movies"
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white font-bold shadow-inner border border-white/20"
          >
            <span className="text-yellow-400 font-extrabold text-sm tracking-wide">intifix+</span>
          </Link>

          <Link
            href="/movies"
            className="px-3 py-1 rounded-full hover:text-white transition"
          >
            Películas
          </Link>

          <Link
            href="/movies"
            className="px-3 py-1 rounded-full hover:text-white transition"
          >
            Series
          </Link>

          <Link
            href="/movies"
            className="hidden sm:inline-block px-3 py-1 rounded-full hover:text-white transition"
          >
            Mi Lista
          </Link>

          <a
            href="#search-section"
            className="w-7 h-7 ml-1 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition"
            title="Buscar títulos"
          >
            🔍
          </a>
        </nav>
      </header>

      {/* 2. EXPLORER: HERO + FEATURED INTERACTIVO + BÚSQUEDA + MODAL */}
      <MovieExplorer heroShow={heroShow} featuredShows={featuredShows} />

      {/* 3. FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 sm:px-14 text-center text-xs text-white/40 space-y-2">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-semibold">
          <span className="text-yellow-400 font-extrabold">intifix tv+</span>
          <span>•</span>
          <span>Streaming de Películas y Series en 4K Ultra HD</span>
        </div>
        <p>
          © 2026 IntiFix Media Entertainment Inc. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
