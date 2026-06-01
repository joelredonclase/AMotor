"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/app/context/AppContext";
import {
  Sparkles,
  X,
  Bot,
  HelpCircle,
  Clock,
  Car,
  ChevronRight,
  LifeBuoy,
  RefreshCw,
  Wallet,
  Zap,
  Gauge,
  Sliders,
} from "lucide-react";

interface AIRecommendation {
  saludoPersonalizado: string;
  analisisPerfil: string;
  modelosRecomendados: {
    marca: string;
    modelo: string;
    precioEstimado: string;
    razonPrincipal: string;
    destaqueDiseno: string;
    tipsPrimerizo?: string;
  }[];
  conclusionAsesor: string;
  isFallback?: boolean;
}

export default function AssistancePanel() {
  const { user, ageLock } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Estados del cuestionario
  const [budget, setBudget] = useState<number>(45000);
  const [primaryUse, setPrimaryUse] = useState<string>("Uso diario en ciudad");
  const [style, setStyle] = useState<string>("Deportivo aerodinámico");
  const [fuel, setFuel] = useState<string>("100% Eléctrico");
  const [experience, setExperience] = useState<string>("Es mi primer vehículo");

  // Estado de carga y resultado
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    setRecommendation(null);

    const payload = {
      username: user ? user.name : "Invitado",
      age: ageLock.age || 18,
      answers: {
        budget,
        primaryUse,
        style,
        fuel,
        experience,
      },
    };

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Ocurrió un error en el servidor de IA.");
      }

      setRecommendation(data);
    } catch (err: any) {
      console.error(err);
      setApiError(
        err.message || "No hemos podido conectar con el asesor virtual de IA. Por favor, comprueba tus claves y vuelve a intentarlo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetQuiz = () => {
    setRecommendation(null);
    setApiError(null);
  };

  return (
    <>
      {/* Botón flotante para abrir la pestaña */}
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-40 px-5 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-2xl flex items-center space-x-2.5 font-bold tracking-wide cursor-pointer hover:shadow-red-500/20 active:scale-95 border border-red-500/30 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span className="text-sm">Asistencia IA Primer Coche</span>
        <span className="bg-red-800 text-red-200 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full font-bold">
          LIVE
        </span>
      </motion.button>

      {/* Caja del Drawer lateral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleToggle}
              className="fixed inset-0 bg-neutral-950 z-40"
            />

            {/* Panel Desplegable */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-zinc-900 border-l border-zinc-800 text-zinc-100 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Cabecera del Panel */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base md:text-lg tracking-tight">Asesor Virtual AMotor</h2>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-wide">
                      INTEGRADO CON GEMINI 3.5 AI
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido en scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-900/40">
                
                {/* Cuadro explicativo para primerizos */}
                <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-start space-x-3.5">
                  <Bot className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-red-400">
                      Especial Primer Vehículo
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      ¿Acabas de sacar el carné o buscas tu primer coche? No te preocupes. Nuestra IA te descifrará los diseños de marcas premium explicándote de forma fácil sus pros técnicos, autonomía y tips de seguridad.
                    </p>
                  </div>
                </div>

                {/* Si no hay recomendación, mostramos el test */}
                {!recommendation && !isLoading && (
                  <form onSubmit={handleSubmitQuiz} className="space-y-6">
                    <div className="border-b border-zinc-800 pb-2">
                      <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold tracking-widest">
                        CUESTIONARIO DE PREFERENCIAS
                      </span>
                    </div>

                    {/* Presupuesto */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-red-500" />
                        Presupuesto Estimado Máximo:
                      </label>
                      <input
                        type="range"
                        min="20000"
                        max="140000"
                        step="5000"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                      <div className="flex justify-between text-xs font-mono text-zinc-400 font-medium pt-1">
                        <span>20.000 €</span>
                        <span className="text-red-400 font-bold">{budget.toLocaleString("es-ES")} €</span>
                        <span>140.000 €</span>
                      </div>
                    </div>

                    {/* Uso Principal */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-red-500" />
                        ¿Cuál será su uso principal diario?
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          "Uso diario en ciudad",
                          "Viajes largos por autopista",
                          "Emociones de fin de semana",
                          "Manejo ecológico eficiente",
                        ].map((uso) => (
                          <button
                            key={uso}
                            type="button"
                            onClick={() => setPrimaryUse(uso)}
                            className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                              primaryUse === uso
                                ? "bg-red-950/45 border-red-500 text-white"
                                : "bg-zinc-850/40 border-zinc-800 text-zinc-400 hover:border-zinc-750"
                            }`}
                          >
                            {uso}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Estilo Prioritario */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-red-500" />
                        Estilo de Carrocería idóneo:
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          "Deportivo aerodinámico",
                          "SUV familiar versátil",
                          "Compacto maniobrable",
                          "Berlina ejecutiva",
                        ].map((est) => (
                          <button
                            key={est}
                            type="button"
                            onClick={() => setStyle(est)}
                            className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                              style === est
                                ? "bg-red-950/45 border-red-500 text-white"
                                : "bg-zinc-850/40 border-zinc-800 text-zinc-400 hover:border-zinc-750"
                            }`}
                          >
                            {est}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Combustible */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-red-500" />
                        Tipo de motorización preferido:
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {["100% Eléctrico", "Híbrido eficiente", "Combustión Gasolina"].map((comb) => (
                          <button
                            key={comb}
                            type="button"
                            onClick={() => setFuel(comb)}
                            className={`p-2 py-3 rounded-xl border text-center font-medium transition-all ${
                              fuel === comb
                                ? "bg-red-950/45 border-red-500 text-white"
                                : "bg-zinc-850/40 border-zinc-800 text-zinc-400 hover:border-zinc-750"
                            }`}
                          >
                            {comb}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experiencia */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-red-500" />
                        Experiencia con vehículos:
                      </label>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {[
                          "Es mi primer coche de la vida (18-25 años)",
                          "Tengo algo de experiencia de conducción previa",
                          "Conductor avanzado buscando maximizar potencia",
                        ].map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => setExperience(exp)}
                            className={`p-3 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                              experience === exp
                                ? "bg-red-950/45 border-red-500 text-white"
                                : "bg-zinc-850/40 border-zinc-800 text-zinc-400 hover:border-zinc-750"
                            }`}
                          >
                            <span>{exp}</span>
                            <div className={`w-3.5 h-3.5 rounded-full border-2 ${experience === exp ? "border-red-500 bg-red-600" : "border-zinc-700"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botón de Enviar */}
                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-bold text-white tracking-wide transition-all shadow-xl hover:shadow-red-900/10 flex items-center justify-center space-x-2 group mt-8 shrink-0"
                    >
                      <Bot className="w-5 h-5" />
                      <span>Generar Recomendación Especial</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}

                {/* Vista cargando */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-red-900/30 border-t-red-600 animate-spin" />
                      <Bot className="w-7 h-7 text-red-500 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-white text-base">Procesando tu ADN automotriz...</h3>
                      <p className="text-zinc-400 text-xs max-w-xs animate-pulse">
                        Nuestro asesor AI está analizando especificaciones técnicas, diseño aerodinámico y el mercado para redactar tu informe personalizado...
                      </p>
                    </div>
                  </div>
                )}

                {/* Mostrar Error de API */}
                {apiError && !isLoading && (
                  <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl space-y-4 text-center">
                    <p className="text-xs text-red-300 font-medium">{apiError}</p>
                    <button
                      onClick={handleResetQuiz}
                      className="inline-flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300 font-semibold underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Volver a intentar</span>
                    </button>
                  </div>
                )}

                {/* Resultado de la Recomendación IA */}
                {recommendation && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-zinc-800/80 rounded-2xl border border-zinc-700/60 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-red-400 uppercase tracking-widest font-mono">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-red-500" />
                          <span>Asesoría Personalizada</span>
                        </div>
                        {recommendation.isFallback && (
                          <span className="text-[10px] bg-red-950/45 text-red-300 border border-red-500/20 px-2.5 py-0.5 rounded-full font-sans tracking-normal font-semibold">
                            mecanismo de salvaguarda activo
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-white text-base md:text-lg mt-2">
                        {recommendation.saludoPersonalizado}
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-300 leading-relaxed mt-2 pt-2 border-t border-zinc-750">
                        {recommendation.analisisPerfil}
                      </p>
                    </div>

                    <div className="border-b border-zinc-800 pb-1.5 mt-8">
                      <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold tracking-widest">
                        COCHES RECOMENDADOS SEGÚN TUGUSTO
                      </span>
                    </div>

                    <div className="space-y-4">
                      {recommendation.modelosRecomendados.map((rec, i) => (
                        <div
                          key={rec.modelo}
                          className="p-5 bg-zinc-850 border border-zinc-800 rounded-2xl relative overflow-hidden"
                        >
                          {/* Marca flotante */}
                          <div className="absolute top-0 right-0 p-3 text-red-500">
                            <Car className="w-5 h-5 opacity-25" />
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-red-400 bg-red-950/50 border border-red-500/20 px-2 py-0.5 rounded-md font-bold uppercase">
                              Opción #{i + 1}
                            </span>
                            <span className="text-xs text-zinc-400 font-semibold">{rec.precioEstimado}</span>
                          </div>

                          <h4 className="font-extrabold text-white text-lg mt-1.5">
                            {rec.marca} {rec.modelo}
                          </h4>

                          <div className="space-y-3.5 mt-3 pt-3 border-t border-zinc-800 text-xs">
                            <div>
                              <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wide font-mono">
                                ¿Por qué encaja contigo?
                              </span>
                              <p className="text-zinc-300 mt-1 leading-relaxed">{rec.razonPrincipal}</p>
                            </div>

                            <div>
                              <span className="block text-[10px] uppercase text-zinc-500 font-semibold tracking-wide font-mono">
                                Aspectos clave de su diseño
                              </span>
                              <p className="text-zinc-300 mt-1 leading-relaxed">{rec.destaqueDiseno}</p>
                            </div>

                            {rec.tipsPrimerizo && (
                              <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/10">
                                <span className="block text-[10px] uppercase text-red-400 font-extrabold tracking-wide font-mono">
                                  💡 Tip para un comprador primerizo:
                                </span>
                                <p className="text-zinc-300 mt-1.5 leading-relaxed">{rec.tipsPrimerizo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-800 text-center text-xs text-zinc-400 italic">
                      {recommendation.conclusionAsesor}
                    </div>

                    <button
                      onClick={handleResetQuiz}
                      className="w-full py-3.5 rounded-xl border border-zinc-750 text-zinc-300 hover:text-white font-bold hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 text-xs"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Volver a hacer el test</span>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Pie de página */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-904 flex items-center justify-center space-x-2 text-[10px] text-zinc-500">
                <LifeBuoy className="w-3.5 h-3.5 text-zinc-500" />
                <span>¿Necesitas ayuda real? Nuestro soporte está activo 24/7.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
