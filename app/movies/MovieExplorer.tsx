'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export interface OMDbShow {
  Title: string
  Year: string
  Rated: string
  Genre: string
  Plot: string
  Poster: string
  imdbID: string
  Type: string
}

export interface MovieDetail extends OMDbShow {
  Released: string
  Runtime: string
  Director: string
  Writer: string
  Actors: string
  Awards: string
  imdbRating: string
  imdbVotes: string
}

interface MovieExplorerProps {
  heroShow: OMDbShow | null
  featuredShows: OMDbShow[]
}

const API_KEY = '668075d0'

export default function MovieExplorer({ heroShow, featuredShows }: MovieExplorerProps) {
  // Modal state
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Search state
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [results, setResults] = useState<OMDbShow[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  // Real-time live search (CSR)
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoadingSearch(true)
      try {
        let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}`
        if (type) url += `&type=${type}`
        if (year) url += `&y=${year}`

        const res = await axios.get(url)
        if (res.data.Response === 'True') {
          setResults(res.data.Search || [])
        } else {
          setResults([])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingSearch(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [query, type, year])

  // Detalle de película para el Modal (CSR)
  useEffect(() => {
    if (!selectedId) {
      setMovieDetail(null)
      return
    }

    const fetchDetail = async () => {
      setLoadingDetail(true)
      try {
        const res = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}&plot=full`
        )
        if (res.data.Response === 'True') {
          setMovieDetail(res.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingDetail(false)
      }
    }

    fetchDetail()
  }, [selectedId])

  return (
    <div className="w-full">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-end pb-20 px-6 sm:px-14 overflow-hidden">
        {/* Background Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/severance-clean.png"
            alt="Severance IntiFix TV Hero"
            className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
          />
          {/* Subtle gradients to blend with dark page and ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090e]/95 via-[#07090e]/40 to-transparent"></div>
        </div>

        {/* Hero Content on Bottom-Left */}
        <div className="relative z-10 max-w-2xl space-y-4 pt-32">
          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-yellow-400 uppercase">
              INTIFIX ORIGINAL
            </span>
            <span className="text-white/40">•</span>
            <span className="text-xs font-medium text-white/80">
              {heroShow?.Genre?.split(',')[0] || 'Thriller'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/40 text-white/90 font-mono font-bold">
              {heroShow?.Rated || 'TV-MA'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-semibold uppercase tracking-wider">
              4K ULTRA HD
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
            {heroShow?.Title || 'Severance'}
          </h1>

          {/* Synopsis */}
          <p className="text-white/85 text-sm sm:text-base leading-relaxed drop-shadow line-clamp-3 max-w-xl">
            {heroShow?.Plot || "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setSelectedId(heroShow?.imdbID || 'tt11280740')}
              className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition shadow-2xl flex items-center gap-2 hover:scale-105 duration-200 cursor-pointer"
            >
              <span>▶</span> Reproducir
            </button>
            <button
              onClick={() => setSelectedId(heroShow?.imdbID || 'tt11280740')}
              className="px-6 py-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white font-medium text-sm transition border border-white/20 flex items-center gap-2 hover:scale-105 duration-200 cursor-pointer"
            >
              <span>ℹ️</span> Más Información
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ROW (CLICKEABLE - ABRE EL MODAL) */}
      <section id="featured-section" className="relative z-10 px-6 sm:px-14 -mt-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Featured
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <span className="font-extrabold text-yellow-400">intifix+</span>
            <span>Originals</span>
          </div>
        </div>

        {/* Horizontal Landscape Cards - Ahora TODOS son interactivos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredShows.map((show) => (
            <div
              key={show.imdbID}
              onClick={() => setSelectedId(show.imdbID)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-yellow-400/80 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-yellow-400/10"
              title="Haz clic para ver detalles"
            >
              {/* Aspect Ratio 16:9 Landscape Video Card */}
              <div className="aspect-video w-full bg-neutral-800 overflow-hidden relative">
                <img
                  src={show.Poster}
                  alt={show.Title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 filter brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                
                {/* IntiFix badge */}
                <span className="absolute bottom-2 right-2 text-[10px] font-black text-yellow-400 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded border border-white/15">
                  intifix+
                </span>
              </div>

              {/* Card Meta */}
              <div className="p-3 bg-neutral-950/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-yellow-400 transition">
                    {show.Title}
                  </h4>
                  <p className="text-[11px] text-white/50 mt-0.5">{show.Year}</p>
                </div>
                <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white/70 border border-white/10">
                  {show.Rated}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORAR Y BUSCAR (CSR) */}
      <section id="search-section" className="relative z-10 px-6 sm:px-14 pt-16 pb-12 max-w-7xl mx-auto space-y-6">
        {/* Contenedor de Búsqueda IntiFix */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Explorar Catálogo
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Encuentra películas, series originales, documentales y estrenos exclusivos.
              </p>
            </div>
            <span className="text-xs text-white/40 font-medium self-start sm:self-auto">
              Actualización en vivo
            </span>
          </div>

          {/* Inputs de Filtro */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, actores o franquicia (ej: Avengers, Batman, Suits)..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/10 focus:border-white/30 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none transition duration-200"
              />
              <span className="absolute left-4 top-4 text-white/40 text-sm">🔍</span>
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-xs text-white/40 hover:text-white bg-white/10 rounded-full w-5 h-5 flex items-center justify-center transition"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="md:col-span-3">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3.5 bg-neutral-900 border border-white/10 focus:border-white/30 rounded-2xl text-white/80 text-sm focus:outline-none transition cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                <option value="movie">Películas</option>
                <option value="series">Series</option>
                <option value="episode">Episodios</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Año (ej: 2024)"
                className="w-full px-4 py-3.5 bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/10 focus:border-white/30 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingSearch && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-xs text-white/40 mt-3 font-medium">Buscando en IntiFix TV...</p>
          </div>
        )}

        {/* Grid de Resultados */}
        {!loadingSearch && results.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white tracking-tight">
                Títulos Encontrados ({results.length})
              </h4>
              <span className="text-xs text-white/40">Haz clic en una portada para ver el detalle</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {results.map((item) => (
                <div
                  key={item.imdbID}
                  onClick={() => setSelectedId(item.imdbID)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-yellow-400/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black"
                >
                  <div className="aspect-[2/3] w-full bg-neutral-900 overflow-hidden relative">
                    {item.Poster !== 'N/A' ? (
                      <img
                        src={item.Poster}
                        alt={item.Title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/30 p-4 text-center">
                        <span className="text-3xl mb-2">🎬</span>
                        <span className="text-xs">Sin portada</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition"></div>
                    <span className="absolute top-2.5 right-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/20">
                      {item.Type}
                    </span>
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-yellow-400 border border-white/10">
                      INTIFIX
                    </span>
                  </div>

                  <div className="p-3.5 absolute bottom-0 left-0 right-0">
                    <h5 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-yellow-400 transition">
                      {item.Title}
                    </h5>
                    <p className="text-xs text-white/50 mt-0.5">{item.Year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. MODAL DE DETALLE COMPLETO (z-[100] PARA NO SER TAPADO POR NADA) */}
      {selectedId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-neutral-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition border border-white/20 font-bold text-sm backdrop-blur cursor-pointer"
            >
              ✕
            </button>

            {/* Contenido del Modal */}
            <div className="overflow-y-auto p-6 sm:p-8">
              {loadingDetail ? (
                <div className="text-center py-24">
                  <div className="inline-block w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm text-white/50 mt-4 font-medium">Cargando detalles...</p>
                </div>
              ) : movieDetail ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Portada y Rating */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-800">
                      {movieDetail.Poster !== 'N/A' ? (
                        <img
                          src={movieDetail.Poster}
                          alt={movieDetail.Title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          Sin Portada
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                      <div className="text-yellow-400 text-2xl font-black flex items-center justify-center gap-1.5">
                        <span>★</span> {movieDetail.imdbRating}
                        <span className="text-xs text-white/40 font-normal">/ 10</span>
                      </div>
                      <p className="text-[11px] text-white/40 mt-1">{movieDetail.imdbVotes} valoraciones</p>
                    </div>
                  </div>

                  {/* Ficha Técnica */}
                  <div className="md:col-span-8 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-yellow-400 border border-white/15 uppercase tracking-wider font-bold">
                          INTIFIX ORIGINAL
                        </span>
                        <span className="text-xs text-white/40 font-medium">4K ULTRA HD • HDR</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {movieDetail.Title}
                      </h2>

                      {/* Insignias de Año, Clasificación y Género */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-white/70">
                        <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 font-medium">
                          {movieDetail.Year}
                        </span>
                        <span className="px-2.5 py-1 bg-white/10 rounded-lg border border-white/10 font-bold text-white">
                          {movieDetail.Rated}
                        </span>
                        <span>{movieDetail.Runtime}</span>
                        <span>•</span>
                        <span className="text-white/90 font-medium">{movieDetail.Genre}</span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3 pt-1">
                      <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition shadow-lg flex items-center gap-2 cursor-pointer">
                        <span>▶</span> Reproducir
                      </button>
                      <button className="px-5 py-2.5 rounded-full bg-white/10 text-white font-medium text-sm hover:bg-white/15 transition border border-white/15 flex items-center gap-2 cursor-pointer">
                        <span>+</span> Mi Lista
                      </button>
                    </div>

                    {/* Sinopsis */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                        Sinopsis
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {movieDetail.Plot}
                      </p>
                    </div>

                    {/* Datos Técnicos y Elenco */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <div>
                        <span className="text-white/40 block mb-0.5">Director:</span>
                        <span className="text-white font-medium">{movieDetail.Director}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block mb-0.5">Guion:</span>
                        <span className="text-white font-medium">{movieDetail.Writer}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-white/40 block mb-0.5">Reparto:</span>
                        <span className="text-white font-medium">{movieDetail.Actors}</span>
                      </div>
                      {movieDetail.Awards && movieDetail.Awards !== 'N/A' && (
                        <div className="sm:col-span-2 pt-1 border-t border-white/5">
                          <span className="text-white/40 block mb-0.5">Premios:</span>
                          <span className="text-yellow-300 font-medium">{movieDetail.Awards}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-white/50 py-12">Detalles no disponibles.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => setSelectedId(null)}
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/10 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
