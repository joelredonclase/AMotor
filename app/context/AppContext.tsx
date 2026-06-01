"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle } from "@/lib/data";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface AgeLock {
  isVerified: boolean;
  age: number;
  lookingFor: string;
}

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  ageLock: AgeLock;
  verifyAge: (age: number, lookingFor: string) => void;
  user: UserProfile | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  cart: Vehicle[];
  addToCart: (vehicle: Vehicle) => void;
  removeFromCart: (vehicleId: string) => void;
  activeBrandId: string;
  setActiveBrandId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeBrandId, setActiveBrandId] = useState<string>("tesla");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<Vehicle[]>([]);
  const [ageLock, setAgeLock] = useState<AgeLock>({
    isVerified: false,
    age: 0,
    lookingFor: "",
  });

  // Carga inicial desde localStorage para persistencia y soporte sin base de datos por ahora (asíncrono)
  useEffect(() => {
    const loadSavedData = () => {
      const savedTheme = localStorage.getItem("amotor_theme") as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
      }

      const savedAge = localStorage.getItem("amotor_age");
      const savedSearch = localStorage.getItem("amotor_looking_for");
      if (savedAge && parseInt(savedAge) >= 18) {
        setAgeLock({
          isVerified: true,
          age: parseInt(savedAge),
          lookingFor: savedSearch || "",
        });
      }

      // Cargar usuario persistido si existe
      const savedUser = localStorage.getItem("amotor_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Cargar carrito específico del usuario
        const savedUserCart = localStorage.getItem(`amotor_cart_${parsedUser.email}`);
        if (savedUserCart) {
          setCart(JSON.parse(savedUserCart));
        }
      } else {
        // Cargar carrito de invitado
        const savedGuestCart = localStorage.getItem("amotor_cart_guest");
        if (savedGuestCart) {
          setCart(JSON.parse(savedGuestCart));
        }
      }
    };

    // Usamos setTimeout para posponer la actualización al final de la cola de eventos y evitar cascading renders
    const timer = setTimeout(loadSavedData, 0);
    return () => clearTimeout(timer);
  }, []);

  // Guardar tema cada vez que cambie
  useEffect(() => {
    localStorage.setItem("amotor_theme", theme);
  }, [theme]);

  // Alternar tema
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Guardar y aplicar verificación de edad
  const verifyAge = (age: number, lookingFor: string) => {
    if (age >= 18) {
      localStorage.setItem("amotor_age", age.toString());
      localStorage.setItem("amotor_looking_for", lookingFor);
      setAgeLock({
        isVerified: true,
        age,
        lookingFor,
      });
    }
  };

  // Simulación de Login de Google mediade una ventana modal limpia (Popup local)
  const loginWithGoogle = async () => {
    return new Promise<void>((resolve) => {
      // Simulamos la apertura de una ventana emergente y respuesta en 1 segundo
      setTimeout(() => {
        const mockNames = [
          "Joel Redón",
          "Alejandro García",
          "Clara Martínez",
          "Mateo Ruiz",
          "Sofía Fernández",
        ];
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        const mockEmail = `${randomName.toLowerCase().replace(" ", "")}@consolacionburriana.com`;
        const randomId = Math.floor(Math.random() * 80);
        const mockAvatar = `https://picsum.photos/id/${randomId}/150/150`;

        const loggedInUser: UserProfile = {
          name: randomName,
          email: mockEmail,
          avatarUrl: mockAvatar,
        };

        setUser(loggedInUser);
        localStorage.setItem("amotor_user", JSON.stringify(loggedInUser));

        // MIGRACIÓN REQUERIDA DE INVITADO A CUENTA EN FIRESTORE (simulada aquí con LocalStorage)
        // Obtenemos los elementos que estaban en el carrito de invitado y los unimos al de cuenta
        const guestCartData = localStorage.getItem("amotor_cart_guest");
        let guestCartItems: Vehicle[] = [];
        if (guestCartData) {
          guestCartItems = JSON.parse(guestCartData);
        }

        const userCartData = localStorage.getItem(`amotor_cart_${mockEmail}`);
        let userCartItems: Vehicle[] = [];
        if (userCartData) {
          userCartItems = JSON.parse(userCartData);
        }

        // Combinar carritos evitando duplicados de vehículos basándonos en ID
        const combinedCart = [...userCartItems];
        guestCartItems.forEach((guestItem) => {
          if (!combinedCart.some((userItem) => userItem.id === guestItem.id)) {
            combinedCart.push(guestItem);
          }
        });

        setCart(combinedCart);
        localStorage.setItem(`amotor_cart_${mockEmail}`, JSON.stringify(combinedCart));

        // Limpiar el del invitado una vez migrado de manera exitosa
        localStorage.removeItem("amotor_cart_guest");
        resolve();
      }, 1000);
    });
  };

  // Cerrar sesión
  const logout = () => {
    if (user) {
      // Guardar de forma ultra segura el estado final
      localStorage.setItem(`amotor_cart_${user.email}`, JSON.stringify(cart));
    }
    setUser(null);
    setCart([]);
    localStorage.removeItem("amotor_user");
    // Restamos el estado de carrito a vacío para simular desconexión
  };

  // Añadir al carrito
  const addToCart = (vehicle: Vehicle) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === vehicle.id);
      if (exists) return prev; // No añadir duplicados

      const updated = [...prev, vehicle];
      if (user) {
        localStorage.setItem(`amotor_cart_${user.email}`, JSON.stringify(updated));
      } else {
        localStorage.setItem("amotor_cart_guest", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Quitar del carrito
  const removeFromCart = (vehicleId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== vehicleId);
      if (user) {
        localStorage.setItem(`amotor_cart_${user.email}`, JSON.stringify(updated));
      } else {
        localStorage.setItem("amotor_cart_guest", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        ageLock,
        verifyAge,
        user,
        loginWithGoogle,
        logout,
        cart,
        addToCart,
        removeFromCart,
        activeBrandId,
        setActiveBrandId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp debe utilizarse dentro de un AppProvider");
  }
  return context;
}
