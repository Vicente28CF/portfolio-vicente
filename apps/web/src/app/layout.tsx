import type { Metadata } from "next";
import "./globals.css";
import { AudienceProvider } from "@/lib/audience-context";
import StatusBar from "@/components/layout/StatusBar";

export const metadata: Metadata = {
  title: "Vicente Cayetano Flores | Portfolio",
  description:
    "Portfolio de Vicente Cayetano Flores, Computer Science Engineering en Guadalajara, Jalisco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">
        <AudienceProvider>{children}</AudienceProvider>
        <StatusBar />
      </body>
    </html>
  );
}
