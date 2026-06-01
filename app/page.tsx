"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/app/context/AppContext";
import AgeFilter from "@/components/AgeFilter";
import Clock from "@/components/Clock";
import CylinderCarousel from "@/components/CylinderCarousel";
import AssistancePanel from "@/components/AssistancePanel";
import AuthSection from "@/components/AuthSection";
import { BRANDS, Vehicle } from "@/lib/data";
import {
  Sun,
  Moon,
  ShoppingCart,
  Trash2,
  CheckCircle,
  Car,
  SlidersHorizontal,
  Zap,
  Flame,
  Activity,
  Sparkles,
  Info,
  ChevronRight,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  const {
    theme,
    toggleTheme,
    ageLock,
    verifyAge,
    activeBrandId,
    cart,
    addToCart,
    removeFromCart,
    user,
  } = useApp();

  const [engineFilter, setEngineFilter] = useState<string>("Todos");
  const [sortOrder, setSortOrder] = useState<"low-to-high" | "high-to-low">("low-to-high");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutId, setCheckoutId] = useState<number>(0);

  // Verificación obligatoria de Edad
  if (!ageLock.isVerified) {
    return <AgeFilter onVerify={verifyAge} />;
  }

  // Obtener la marca activa y vehículos
  const activeBrand = BRANDS.find((b) => b.id === activeBrandId) || BRANDS[0];

  // Aplicar filtros en el catálogo de coches de la marca seleccionada
  let filteredVehicles = activeBrand.vehicles;
  if (engineFilter !== "Todos") {
    filteredVehicles = filteredVehicles.filter((v) => v.engineType === engineFilter);
  }

  // Criterios de ordenación
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    return sortOrder === "low-to-high" ? a.price - b.price : b.price - a.price;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutId(Math.floor(100000 + Math.random() * 900000));
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setIsCartOpen(false);
      // Vaciar carrito tras la simulación de compra exitosa
      cart.forEach((item) => removeFromCart(item.id));
    }, 4500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      theme === "dark" ? "dark bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    }`}>
      
      {/* HEADER NAVBAR GLOBAL */}
      <header className="w-full border-b border-zinc-200/55 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo y Nombre de Marca */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 antialiased">
              <Car className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                AMotor
              </span>
              <span className="block text-[8px] tracking-widest font-mono text-red-500 font-extrabold uppercase leading-none">
                A DOMICILIO
              </span>
            </div>
          </div>

          {/* Menú de herramientas del medio (Opciones informativas de experiencia) */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Garantía de Entrega Asegurada</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>18 o más años verificado: {ageLock.age} años</span>
            </div>
          </div>

          {/* Componentes de la Esquina Derecha */}
          <div className="flex items-center space-x-4">
            
            {/* Reloj y Fecha Integrados obligatorio fijo en top right */}
            <div className="hidden md:block">
              <Clock />
            </div>

            {/* Alternador de Tema manual */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:border-red-500/50 dark:hover:border-red-500/50 transition-colors shadow-sm cursor-pointer"
              title={theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Carrito de compra flotante trigger bubble */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 px-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all flex items-center space-x-2.5 shadow-sm relative cursor-pointer"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-red-500" />
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {cart.length}
              </span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full text-[8px] text-white flex items-center justify-center font-bold animate-bounce">
                  !
                </span>
              )}
            </button>

            {/* Panel de Autenticación Firebase simulado */}
            <AuthSection />

          </div>
        </div>
      </header>

      {/* Reloj visible en móviles al inicio del contenido para no perder visibilidad */}
      <div className="block md:hidden max-w-7xl mx-auto px-4 mt-4">
        <Clock />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-24">
        
        {/* BANNER RECEPTOR DE INTERESES DEL FILTRO DE ENTRADA */}
        <section className="mb-10 p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-850/80 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 shrink-0">
              <Sparkles className="w-55 h-5.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase font-mono text-zinc-500 dark:text-zinc-400 font-extrabold block">
                Contenido Personalizado Para Ti
              </span>
              <h1 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                Búsqueda filtrada: <span className="text-red-500 italic">&ldquo;{ageLock.lookingFor}&rdquo;</span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mt-1">
                Hemos pre-configurado nuestros algoritmos de aerodinámica y opciones de entrega express adaptándonos detalladamente a tus intereses de comprador de primer nivel.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center space-x-3 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500">¿No es lo que buscabas?</span>
            <button
              onClick={() => {
                localStorage.removeItem("amotor_age");
                window.location.reload();
              }}
              className="p-2 px-3.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold transition-all shrink-0 cursor-pointer text-xs"
            >
              Reiniciar Filtro
            </button>
          </div>
        </section>

        {/* SECCIÓN DEL CYLINDER SELECTOR DE MARCAS */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6">
            <div>
              <span className="text-[10px] uppercase font-mono text-red-500 tracking-widest font-black">
                Selector de Marcas 3D
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-0.5">
                Gira el Tambor Cilíndrico
              </h2>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 md:mt-0 max-w-sm leading-relaxed">
              Inspirado en una ruleta vertical de alta ingeniería, haz clic en cada fabricante automotriz para ver su dossier completo y catálogo específico.
            </p>
          </div>

          <CylinderCarousel />
        </section>

        {/* CATÁLOGO DINÁMICO DE VEHÍCULOS DE LA MARCA ACTIVA */}
        <section className="mt-12">
          {/* Cabecera del Catálogo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-zinc-200 dark:border-zinc-850 py-5 mb-8 gap-4">
            
            {/* Título de catálogo */}
            <div className="flex items-center space-x-3.5">
              <div className="w-1.5 h-7 bg-red-600 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Modelos de {activeBrand.name} Disponibles
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Totalmente revisados, certificados y listos para envío inmediato a tu puerta.
                </p>
              </div>
            </div>

            {/* Caja de filtros y ordenamiento */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro por tipo de combustible */}
              <div className="flex items-center bg-zinc-250/50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                {["Todos", "Eléctrico", "Híbrido", "Gasolina"].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setEngineFilter(tipo)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      engineFilter === tipo
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              {/* Botón de ordenación de precio */}
              <button
                onClick={() => setSortOrder(sortOrder === "low-to-high" ? "high-to-low" : "low-to-high")}
                className="p-2 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-zinc-500 font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  Precio: {sortOrder === "low-to-high" ? "Menor a Mayor" : "Mayor a Menor"}
                </span>
              </button>
            </div>

          </div>

          {/* Listado de Vehículos en cuadrícula */}
          {sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedVehicles.map((vehicle: Vehicle) => {
                const alreadyInCart = cart.some((item) => item.id === vehicle.id);
                return (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-300 flex flex-col h-full"
                  >
                    
                    {/* Imagen de cabecera con Badge de combustible */}
                    <div className="relative w-full aspect-[16/10] bg-zinc-200/50 dark:bg-zinc-950/40 overflow-hidden">
                      <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Badge del tipo de motor */}
                      <div className="absolute top-4 left-4 flex gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full text-white tracking-widest flex items-center gap-1.5 shadow-sm bg-zinc-900/80 backdrop-blur-md`}>
                          {vehicle.engineType === "Eléctrico" ? (
                            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          ) : vehicle.engineType === "Híbrido" ? (
                            <Activity className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <Flame className="w-3.5 h-3.5 text-red-500" />
                          )}
                          <span>{vehicle.engineType}</span>
                        </span>

                        <span className="text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full text-white tracking-widest bg-zinc-900/80 backdrop-blur-md shadow-sm">
                          {vehicle.category}
                        </span>
                      </div>

                      {/* Timeline de envío Express flotante */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-red-600/90 text-[10px] text-white font-extrabold font-mono tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-lg">
                        <span>🚀 {vehicle.specs.deliveryTime}</span>
                      </div>
                    </div>

                    {/* Cuerpo de información */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-end justify-between">
                          <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            {vehicle.name}
                          </h4>
                          <span className="text-xl md:text-2xl font-mono font-black text-red-500">
                            {vehicle.price.toLocaleString("es-ES")} €
                          </span>
                        </div>

                        <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans mt-2">
                          {vehicle.description}
                        </p>

                        {/* Ficha técnica specs rápida */}
                        <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80 text-[11px] font-mono">
                          <div className="bg-zinc-100/60 dark:bg-zinc-850/60 p-2.5 rounded-xl text-center border border-zinc-200/20">
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                              Acel (0-100)
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-250 mt-0.5 block">
                              {vehicle.specs.acceleration}
                            </span>
                          </div>
                          <div className="bg-zinc-100/60 dark:bg-zinc-850/60 p-2.5 rounded-xl text-center border border-zinc-200/20">
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                              Potencia
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-250 mt-0.5 block">
                              {vehicle.specs.power}
                            </span>
                          </div>
                          <div className="bg-zinc-100/60 dark:bg-zinc-850/60 p-2.5 rounded-xl text-center border border-zinc-200/20">
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-zinc-500">
                              Rendimiento
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-250 mt-0.5 block truncate">
                              {vehicle.specs.rangeOrConsumption}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="mt-8 pt-4">
                        <button
                          onClick={() => {
                            if (alreadyInCart) {
                              removeFromCart(vehicle.id);
                            } else {
                              addToCart(vehicle);
                            }
                          }}
                          className={`w-full py-4.5 px-6 rounded-2xl font-bold tracking-wider text-xs uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            alreadyInCart
                              ? "bg-zinc-200 text-zinc-800 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                              : "bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/20"
                          }`}
                        >
                          {alreadyInCart ? (
                            <>
                              <Trash2 className="w-4 h-4 shrink-0" />
                              <span>Quitar del Pedido</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 shrink-0" />
                              <span>Agregar a Pedido Domiciliario</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Estado vacío si no hay vehículos con el tipo de combustible */
            <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl">
              <Info className="w-8 h-8 text-zinc-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-zinc-650 dark:text-zinc-350 mt-3">
                No hay modelos de {activeBrand.name} que se ajusten al combustible &ldquo;{engineFilter}&rdquo;.
              </p>
              <button
                onClick={() => setEngineFilter("Todos")}
                className="mt-4 inline-block text-xs font-bold text-red-500 underline"
              >
                Ver todos los vehículos de esta marca
              </button>
            </div>
          )}
        </section>

      </main>

      {/* PESTAÑA PLEGABLE DE ASISTENCIA CON INTEGRACIÓN GENERATIVA IA */}
      <AssistancePanel />

      {/* COMPONENTE INTERACTIVO PANEL COMPREGNA DE PEDIDO / CARRITO */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop del Carrito */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-neutral-950 z-40"
            />

            {/* Slider del carrito */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 text-zinc-100 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Cabecera del Carrito */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base md:text-lg">Tu Pedido AMotor</h3>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
                      LOGÍSTICA EXCLUSIVA A DOMICILIO
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 px-2.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-bold bg-zinc-800"
                >
                  Cerrar
                </button>
              </div>

              {/* Lista de vehículos en el carrito */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length > 0 ? (
                  cart.map((car) => {
                    const carBrand = BRANDS.find((b) => b.id === car.brandId);
                    return (
                      <div
                        key={car.id}
                        className="p-4 bg-zinc-850 border border-zinc-800 rounded-2xl flex items-start justify-between gap-3 relative"
                      >
                        <div className="flex items-start space-x-3.5">
                          {/* Mini foto coche */}
                          <div className="w-16 h-12 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-700">
                            <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-mono text-red-500 tracking-wider font-extrabold">
                              {carBrand?.name}
                            </span>
                            <h4 className="font-bold text-white text-xs md:text-sm mt-0.5">{car.name}</h4>
                            <span className="text-zinc-400 font-mono text-xs font-semibold block mt-1">
                              {car.price.toLocaleString("es-ES")} €
                            </span>
                          </div>
                        </div>

                        {/* Acciones del ítem (Eliminar) */}
                        <button
                          onClick={() => removeFromCart(car.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 tracking-wider hover:bg-zinc-750 transition-all cursor-pointer mt-1"
                          title="Eliminar este ítem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  /* Vacío */
                  <div className="py-24 text-center text-zinc-500 flex flex-col items-center justify-center space-y-3">
                    <Car className="w-10 h-10 text-zinc-650 animate-bounce" />
                    <div>
                      <p className="text-sm font-bold text-zinc-400">Tu pedido está vacío.</p>
                      <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
                        Explora la gama deportiva, híbrida y eléctrica de AMotor y añade unidades para iniciar la compra segura a domicilio.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pie de Pedido y Checkout */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-zinc-800 bg-zinc-950/70 backdrop-blur-md space-y-4">
                  {/* Totalizador */}
                  <div className="space-y-1.5 font-sans">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Subtotal vehículos:</span>
                      <span className="font-semibold">{cartTotal.toLocaleString("es-ES")} €</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Gastos de matriculación:</span>
                      <span className="text-emerald-500 font-extrabold uppercase">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Transporte a domicilio asegurado:</span>
                      <span className="text-emerald-500 font-extrabold uppercase">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-sm text-white pt-2.5 border-t border-zinc-850 font-bold">
                      <span className="uppercase text-xs tracking-wider">Total Final:</span>
                      <span className="font-mono text-base md:text-lg text-red-500">
                        {cartTotal.toLocaleString("es-ES")} €
                      </span>
                    </div>
                  </div>

                  {/* Advertencia registro o checkout directo */}
                  {!user && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-start space-x-2.5">
                      <Info className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-zinc-300 leading-normal">
                        Navegas como <strong className="text-amber-500 font-bold">Invitado</strong>. Puedes continuar con la compra directa, pero te recomendamos iniciar sesión con Google para sincronizar y proteger este pedido para siempre.
                      </p>
                    </div>
                  )}

                  {/* Acciones de compra */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 font-bold text-white tracking-widest text-xs uppercase transition-all shadow-xl hover:shadow-red-900/10 cursor-pointer"
                  >
                    Confirmar Compra y Envío express
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de checkout exitoso */}
      <AnimatePresence>
        {checkoutSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl" />
              
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-black">
                  Orden de Pedido Validada
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  ¡Vehículo Reservado!
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                  Hemos redactado la hoja de ruta logística. El vehículo seleccionado se encuentra en fase de inspección premium y se encuentra precintado para su envío express y gratuito a tu domicilio.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl text-[11px] font-mono leading-normal text-left space-y-1.5">
                <p className="text-zinc-400"><strong className="text-white">ID de compra:</strong> AMOT-{checkoutId}</p>
                <p className="text-zinc-400"><strong className="text-white">Modalidad:</strong> Pago y entrega a domicilio asegurado</p>
                <p className="text-zinc-400"><strong className="text-white">Plazo estimado:</strong> 72 horas</p>
                <p className="text-zinc-400"><strong className="text-white">Garante:</strong> Joél Redón (Logística Segura AMotor)</p>
              </div>

              <p className="text-[10px] text-zinc-500 animate-pulse">
                Procesando transacción criptográfica... Espera un momento.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
