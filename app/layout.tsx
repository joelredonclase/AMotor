import type { Metadata } from "next";
import "./globals.css"; // Global styles
import { AppProvider } from "@/app/context/AppContext";

export const metadata: Metadata = {
  title: "AMotor | Compra de vehículos a domicilio premium",
  description: "Una experiencia avanzada y tecnológica para adquirir tu próximo coche con envío directo a tu hogar y asesoramiento de IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
