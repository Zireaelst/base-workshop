import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = "https://base-workshop-app.vercel.app";
  return {
    title: "Base Tombala - Decentralized Turkish Bingo",
    description: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
    keywords: ["tombala", "bingo", "blockchain", "base", "ethereum", "web3", "game"],
    authors: [{ name: "Base Tombala Team" }],
    creator: "Base Tombala",
    publisher: "Base Tombala",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: URL,
    },
    openGraph: {
      title: "Base Tombala - Decentralized Turkish Bingo",
      description: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
      url: URL,
      siteName: "Base Tombala",
      images: [
        {
          url: `${URL}/hero.png`,
          width: 1200,
          height: 630,
          alt: "Base Tombala Game",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Base Tombala - Decentralized Turkish Bingo",
      description: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
      images: [`${URL}/hero.png`],
    },
    manifest: `${URL}/manifest.json`,
    icons: {
      icon: [
        { url: `${URL}/icon.png`, sizes: "192x192", type: "image/png" },
        { url: `${URL}/icon.png`, sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: `${URL}/icon.png`, sizes: "192x192", type: "image/png" },
      ],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/hero.png`,
        button: {
          title: "Launch Base Tombala",
          action: {
            type: "launch_frame",
            name: "Base Tombala",
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#0f0f0f",
          },
        },
      }),
      "minikit:version": "1.0.0",
      "minikit:permissions": "wallet,transactions",
      "minikit:chains": "base-sepolia,base",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
