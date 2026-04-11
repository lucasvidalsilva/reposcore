import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoScore — Descubra o valor da sua ideia",
  description:
    "Ferramenta gamificada de avaliação de repositórios do GitHub. Analise o esforço, criatividade e organização do seu código com Inteligência Artificial.",
  keywords: ["github", "avaliação", "repositório", "código", "IA", "ranking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col relative">
        {/* Ambient light beam */}
        <div className="light-beam" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
