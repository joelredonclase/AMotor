"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle } from "@/lib/data";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, syncUserProfile, getCartFromFirestore, saveCartToFirestore } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
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
  logout: () => Promise<void>;
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

  // Carga inicial y observador en tiempo real de Firebase Auth + Firestore
  useEffect(() => {
    // Cargar configuraciones de forma asíncrona para evitar cascading renders sincrónicos en el efecto
    const timer = setTimeout(() => {
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
    }, 0);

    // Suscribirse a los cambios del estado de autenticación real de Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || "Usuario de Google";
        const email = firebaseUser.email || "";
        const avatarUrl = firebaseUser.photoURL || `https://picsum.photos/id/10/150/150`;
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name,
          email,
          avatarUrl,
        };
        setUser(profile);

        // Obtener elementos del carrito de invitado por si hay que migrar
        const guestCartData = localStorage.getItem("amotor_cart_guest");
        let guestCartItems: Vehicle[] = [];
        if (guestCartData) {
          try {
            guestCartItems = JSON.parse(guestCartData);
          } catch (e) {
            console.error("Error al parsear el carrito de invitado:", e);
          }
        }

        // Obtener del Firestore el carrito persistente del usuario
        const firestoreCartItems = await getCartFromFirestore(firebaseUser.uid);
        let finalCart: Vehicle[] = firestoreCartItems || [];

        // Si hay elementos de invitado locales, migrarlos uniéndolos al de Firestore
        if (guestCartItems.length > 0) {
          const combined = [...finalCart];
          guestCartItems.forEach((guestItem) => {
            if (!combined.some((userItem) => userItem.id === guestItem.id)) {
              combined.push(guestItem);
            }
          });
          finalCart = combined;
          
          // Escribir en Firestore el carrito migrado combinado
          await saveCartToFirestore(firebaseUser.uid, finalCart);
          
          // Limpiar el carrito de invitado para evitar doble migración
          localStorage.removeItem("amotor_cart_guest");
        }

        setCart(finalCart);
      } else {
        setUser(null);
        // Si no está registrado o autenticado, cargar el carrito de invitado local
        const savedGuestCart = localStorage.getItem("amotor_cart_guest");
        if (savedGuestCart) {
          try {
            setCart(JSON.parse(savedGuestCart));
          } catch (e) {
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
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

  // Iniciar Sesión de Google usando ventana emergente (Popup nativo de Firebase SDK)
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      if (firebaseUser) {
        const name = firebaseUser.displayName || "Usuario de Google";
        const email = firebaseUser.email || "";
        const avatarUrl = firebaseUser.photoURL || `https://picsum.photos/id/10/150/150`;
        // Sincronizar el perfil del usuario de forma persistente en Firestore en su login
        await syncUserProfile(firebaseUser.uid, name, email, avatarUrl);
      }
    } catch (err) {
      console.error("Error en loginWithGoogle de Firebase Auth:", err);
      throw err;
    }
  };

  // Cerrar sesión en Firebase Auth
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCart([]);
      
      // Intentar cargar el carrito de invitado existente tras desloguearse
      const savedGuestCart = localStorage.getItem("amotor_cart_guest");
      if (savedGuestCart) {
        try {
          setCart(JSON.parse(savedGuestCart));
        } catch (e) {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error al cerrar sesión mediante Firebase Auth:", err);
    }
  };

  // Añadir un vehículo al carrito de forma progresiva y sincronizada
  const addToCart = (vehicle: Vehicle) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === vehicle.id);
      if (exists) return prev; // Prevenir duplicidades innecesarias

      const updated = [...prev, vehicle];
      if (user) {
        // Guardar asíncronamente en Firestore
        saveCartToFirestore(user.uid, updated).catch(console.error);
      } else {
        localStorage.setItem("amotor_cart_guest", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Quitar un vehículo del carrito y sincronizar cambios
  const removeFromCart = (vehicleId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== vehicleId);
      if (user) {
        // Sincronizar asíncronamente con Firestore
        saveCartToFirestore(user.uid, updated).catch(console.error);
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
