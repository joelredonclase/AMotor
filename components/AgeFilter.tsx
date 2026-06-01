"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ArrowRight, Sparkles, Car } from "lucide-react";

interface AgeFilterProps {
  onVerify: (age: number, lookingFor: string) => void;
}

const MOTIVOS = [
  "Quiero comprar mi primer coche a domicilio",
  "Busco deportividad pura y de altas prestaciones",
  "Necesito un coche eléctrico/híbrido tecnológico",
  "Un SUV familiar premium directo a mi puerta",
  "Solo quiero explorar el catálogo de alta gama",
];

export default function AgeFilter({ onVerify }: AgeFilterProps) {
  const [age, setAge] = useState<number>(20);
  const [lookingFor, setLookingFor] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [ageError, setAgeError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age < 18) {
      setAgeError("Debes ser mayor de 18 años para acceder y comprar un vehículo en AMotor.");
      return;
    }
    if (!lookingFor) {
      setAgeError("Por favor, indícanos qué estás buscando para personalizar tu experiencia.");
      return;
    }
    setAgeError("");
    setSubmitted(true);
    
    // Almacenamos y levantamos el filtro con animación fluida
    setTimeout(() => {
      onVerify(age, lookingFor);
    }, 600);
  };

  return (
    <AnimatePresence>
      {!submitted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950 text-white overflow-y-auto"
        >
          {/* Fondo estético con sutiles círculos de luz neón */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,28,28,0.12),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.12),transparent_60%)] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full max-w-xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative z-10"
          >
            {/* Cabecera del Portal */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="p-4 bg-red-600/10 rounded-2xl border border-red-500/30">
                <Car className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-red-500 font-semibold font-sans">
                  Verificación de Acceso Seguro
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">
                  AMOTOR
                </h1>
                <p className="text-zinc-400 text-sm mt-2 max-w-sm">
                  La experiencia definitiva para comprar tu coche desde casa. Confirma tu perfil para empezar.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Edad Requerida */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  ¿Qué edad tienes actualmente? <span className="text-xs text-zinc-500">(Mínimo 18 años)</span>
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="16"
                    max="80"
                    value={age}
                    onChange={(e) => {
                      setAge(parseInt(e.target.value));
                      if (parseInt(e.target.value) >= 18) setAgeError("");
                    }}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <span className="w-16 text-center font-mono text-xl font-bold px-3 py-1 bg-zinc-800 border border-zinc-750 text-red-400 rounded-lg">
                    {age}
                  </span>
                </div>
                {age < 18 && (
                  <p className="text-xs text-red-400 font-medium">
                    🔞 Por ley, necesitas tener más de 18 años para comprar vehículos.
                  </p>
                )}
              </div>

              {/* ¿Qué buscas hoy? */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300">
                  ¿Qué es lo que estás buscando hoy en AMotor?
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {MOTIVOS.map((motivo) => {
                    const isSelected = lookingFor === motivo;
                    return (
                      <button
                        key={motivo}
                        type="button"
                        onClick={() => {
                          setLookingFor(motivo);
                          setAgeError("");
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-250 text-xs md:text-sm flex items-center justify-between group ${
                          isSelected
                            ? "bg-red-950/40 border-red-500 text-white shadow-md"
                            : "bg-zinc-850/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center space-x-2.5">
                          <Sparkles className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-red-400" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                          <span>{motivo}</span>
                        </span>
                        <div
                          className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? "border-red-500 bg-red-600" : "border-zinc-700"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Errores */}
              {ageError && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-xl text-xs md:text-sm text-red-300 font-medium"
                >
                  {ageError}
                </motion.div>
              )}

              {/* Botón de Entrada */}
              <button
                type="submit"
                disabled={age < 18 || !lookingFor}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-bold tracking-wide text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xl hover:shadow-red-900/20 flex items-center justify-center space-x-2 group shrink-0"
              >
                <span>Acceder a la Experiencia</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-2 text-zinc-500 text-xs text-center border-t border-zinc-800/80 pt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Plataforma cifrada de transacciones seguras de automoción.</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
