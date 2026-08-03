import type { Metadata } from "next";
import { Bodoni_Moda, Source_Serif_4, Metrophobic } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const metrophobic = Metrophobic({
  variable: "--font-metrophobic",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mirrormemusic.com"),
  title: "MirrorMeMusic",
  description:
    "MirrorMeMusic is an AI-guided platform for independent artists to develop release strategy, branding, and creative direction with the AI Strategist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${bodoniModa.variable} ${sourceSerif4.variable} ${metrophobic.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
