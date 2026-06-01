"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BRANDS, Brand } from "@/lib/data";
import { useApp } from "@/app/context/AppContext";
import { ChevronUp, ChevronDown, Rocket, Compass, ShieldAlert } from "lucide-react";

export default function CylinderCarousel() {
  const { activeBrandId, setActiveBrandId, theme } = useApp();

  const activeIndex = BRANDS.findIndex((b) => b.id === activeBrandId);

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % BRANDS.length;
    setActiveBrandId(BRANDS[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + BRANDS.length) % BRANDS.length;
    setActiveBrandId(BRANDS[prevIndex].id);
  };

  // Obtenemos los coches asociados a la marca seleccionada
  const selectedBrand = BRANDS[activeIndex];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      {/* Columna Izquierda: El Cilindro Tecnológico 3D (Ocupa 5/12 en pantallas grandes) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[440px] md:min-h-[500px]">
        
        {/* Adorno de órbita holográfica en el fondo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden0">
          <div className="w-[320px] h-[320px] rounded-full border border-dashed border-red-500/15 dark:border-red-500/10 animate-spin" style={{ animationDuration: "60s" }} />
          <div className="w-[420px] h-[420px] absolute rounded-full border border-zinc-200 dark:border-zinc-800/60 opacity-30" />
        </div>

        {/* Indicador de Línea Activa */}
        <div className="absolute left-4 md:left-8 right-4 md:right-8 h-[90px] border-y-2 border-red-500/20 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5 rounded-2xl pointer-events-none flex items-center justify-between px-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <div className="font-mono text-[9px] uppercase tracking-widest text-red-500 font-bold opacity-75 hidden md:block">
            ZONA DE SELECCIÓN ACTIVA
          </div>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>

        {/* Botón Superior */}
        <button
          onClick={handlePrev}
          aria-label="Subir marca"
          className="absolute top-2 z-30 p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-red-500 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-all shadow-md active:scale-95"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Contenedor del Tambor Cilíndrico con CSS 3D */}
        <div 
          className="relative w-full max-w-[280px] h-[340px] flex items-center justify-center"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {BRANDS.map((brand, idx) => {
            // Calculamos la distancia rotacional relativa al elemento activo actual
            let offset = idx - activeIndex;
            
            // Corrige la desviación circular para que la ruleta se desplace de forma cíclica
            const total = BRANDS.length;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isSelected = idx === activeIndex;
            
            // Matemática tridimensional para el tambor cilíndrico visto de lado
            const rotationX = offset * 26; // Grados de rotación vertical
            const translateY = offset * 74; // Desplazamiento de altura
            const translateZ = Math.cos(offset * (26 * Math.PI / 180)) * 50 - 50; // Profundidad proyectada en el fondo
            const opacity = isSelected ? 1 : Math.max(0.12, 1 - Math.abs(offset) * 0.4);
            const scale = isSelected ? 1.05 : Math.max(0.8, 1 - Math.abs(offset) * 0.12);

            return (
              <motion.div
                key={brand.id}
                onClick={() => setActiveBrandId(brand.id)}
                className={`absolute w-full px-4 h-[76px] cursor-pointer flex items-center justify-between rounded-xl border transition-all duration-300 select-none ${
                  isSelected
                    ? "bg-zinc-900/90 dark:bg-zinc-950 border-red-500/80 shadow-lg shadow-red-500/5 text-white"
                    : "bg-white/80 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                }`}
                style={{
                  transform: `rotateX(${rotationX}deg) translateY(${translateY}px) translateZ(${translateZ}px) scale(${scale})`,
                  opacity,
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/80 shrink-0 select-none bg-zinc-950 shadow-sm">
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm tracking-tight">{brand.name}</h3>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium tracking-wide">
                      {brand.origin}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isSelected ? "bg-red-950/40 text-red-400 border border-red-500/20" : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500"
                  }`}>
                    {brand.vehicles.length} modelos
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón Inferior */}
        <button
          onClick={handleNext}
          aria-label="Bajar marca"
          className="absolute bottom-2 z-30 p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-red-500 text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-all shadow-md active:scale-95"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Pequeño control táctil explicativo */}
        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mt-10 font-mono font-medium flex items-center space-x-1.5 justify-center">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Rueda o pulsa para rotar</span>
        </p>

      </div>

      {/* Columna Derecha: Vista Dinámica Detallada de la Marca Seleccionada (Ocupa 7/12) */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBrand.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="p-6 md:p-8 rounded-3xl bg-zinc-500/5 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/60 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Sutil halo brillante trasero */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="flex items-start justify-between gap-2.5 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shrink-0 bg-zinc-950 shadow-md">
                  <img 
                    src={selectedBrand.logoUrl} 
                    alt={selectedBrand.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-extrabold flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5" />
                    Dossier del Fabricante
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                    {selectedBrand.name}
                  </h2>
                </div>
              </div>
              <span className="text-xs text-zinc-500 font-semibold uppercase font-mono bg-zinc-200/40 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/40 px-2.5 py-1 rounded-lg">
                Hq: {selectedBrand.origin}
              </span>
            </div>

            <p className="text-indigo-600 dark:text-red-400 font-sans italic text-sm md:text-base font-semibold mt-1">
              &ldquo;{selectedBrand.slogan}&rdquo;
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mt-4">
              {selectedBrand.description}
            </p>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-zinc-200/30 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/20">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono">
                  Envío a Domicilio
                </span>
                <span className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 mt-1 block">
                  Seguro Completo 100%
                </span>
              </div>
              <div className="p-3.5 bg-zinc-200/30 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/20">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold font-mono">
                  Garantía Premium
                </span>
                <span className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100 mt-1 block">
                  5 Años o 100.000km
                </span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
