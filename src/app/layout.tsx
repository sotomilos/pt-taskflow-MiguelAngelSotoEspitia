import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow | Prueba Técnica Frontend",
  description:
    "Aplicación de gestión de tareas desarrollada con Next.js, React, TypeScript y Tailwind CSS. Incluye paginación, filtros locales, actualizaciones optimistas y manejo de estado con Zustand usando la API de DummyJSON.",
  icons: {
    icon: "/task.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
