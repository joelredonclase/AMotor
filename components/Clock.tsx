"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock as ClockIcon } from "lucide-react";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Establecemos la hora diferida para evitar cascading renders síncronos
    const timer = setTimeout(() => {
      setTime(new Date());
    }, 0);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!time) {
    return (
      <div className="flex items-center space-x-2 text-zinc-400 font-mono text-sm">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
        <span>Sincronizando reloj...</span>
      </div>
    );
  }

  // Formato español de la hora: HH:MM:SS
  const timeString = time.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Formato español de la fecha: Lunes, 25 de mayo de 2026
  const dateString = time.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-end p-2 px-3 bg-zinc-900/40 dark:bg-zinc-950/60 backdrop-blur-md rounded-xl border border-zinc-200/10 dark:border-zinc-800/60 text-right shadow-sm select-none"
    >
      <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-mono font-semibold tracking-wider text-sm md:text-base">
        <ClockIcon className="w-4 h-4 text-red-500 animate-pulse" />
        <span>{timeString}</span>
      </div>
      <div className="flex items-center space-x-1.5 text-[10px] md:text-xs text-zinc-500 font-sans tracking-wide mt-0.5 font-medium uppercase">
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span>{dateString}</span>
      </div>
    </motion.div>
  );
}
