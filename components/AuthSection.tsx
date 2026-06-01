"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/app/context/AppContext";
import { LogIn, LogOut, User, Sparkles, CheckCircle, RefreshCw, Car } from "lucide-react";

export default function AuthSection() {
  const { user, loginWithGoogle, logout, cart } = useApp();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      // Mostrar feedback de migración de carrito exitosa si había elementos
      setShowSyncSuccess(true);
      setTimeout(() => {
        setShowSyncSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center space-x-3.5 relative">
      <AnimatePresence mode="wait">
        {user ? (
          /* Estado: Usuario Conectado con Perfil Persistido */
          <motion.div
            key="logged-in"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center space-x-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 pr-3.5 rounded-full shadow-sm"
          >
            {/* Foto de Perfil de Google */}
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-red-500/30 object-cover shadow-inner"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Texto informativo */}
            <div className="hidden sm:block text-left">
              <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight line-clamp-1">
                {user.name}
              </p>
              <p className="text-[9px] text-zinc-500 dark:text-zinc-500 tracking-normal font-mono font-medium leading-none line-clamp-1">
                {user.email}
              </p>
            </div>

            {/* Separador */}
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            {/* Botón Logout */}
            <button
              onClick={logout}
              className="p-1 px-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase font-mono tracking-wider hidden md:inline">
                Salir
              </span>
            </button>
          </motion.div>
        ) : (
          /* Estado: Navegación de Invitado / Botón Login */
          <motion.div
            key="logged-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-3.5"
          >
            {/* Indicador de Invitado */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-850 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase font-mono text-zinc-600 dark:text-zinc-400 tracking-wider">
                Invitado
              </span>
            </div>

            {/* Botón Iniciar Sesión con Google */}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="relative overflow-hidden p-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 font-bold text-xs md:text-sm tracking-wide rounded-full flex items-center space-x-2 shadow-md transition-all active:scale-95 disabled:pointer-events-none cursor-pointer border border-zinc-800 dark:border-white"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                  <span className="text-xs">Conectando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-0.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.185 15.42 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.56-4.465 10.56-10.74 0-.725-.08-1.28-.175-1.835l-10.385.12z" />
                  </svg>
                  <span>Google Auth</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificación flotante de sincronización del carrito de invitado */}
      <AnimatePresence>
        {showSyncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="absolute top-14 right-0 z-50 p-3 bg-zinc-950/95 border border-emerald-500 text-white rounded-2xl shadow-xl w-64 text-left flex items-start space-x-2.5 backdrop-blur-md"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-[11px] font-extrabold font-sans text-emerald-400 uppercase tracking-wider">
                Sincronización Exitosa
              </h5>
              <p className="text-[10px] text-zinc-300 leading-normal">
                ¡Tu sesión ha sido securizada! El carrito de invitado se ha migrado automáticamente a tu cuenta.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
