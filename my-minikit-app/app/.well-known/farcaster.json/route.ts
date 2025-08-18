/// <reference types="node" />

function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  // Use the correct domain for the app
  const URL = "https://base-workshop-app.vercel.app";

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD, 
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: "Base Tombala",
      subtitle: "Decentralized Turkish Bingo on Base",
      description: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
      screenshotUrls: [
        `${URL}/screenshot.png`
      ],
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#0f0f0f",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "games",
      tags: ["tombala", "bingo", "web3", "base", "eth"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Play Turkish Bingo on Base",
      ogTitle: "Base Tombala - Decentralized Turkish Bingo",
      ogDescription: "Win ETH by betting on numbers 1-25! Experience the classic Turkish Bingo game on Base blockchain.",
      ogImageUrl: `${URL}/hero.png`,
      requiredChains: ["eip155:8453", "eip155:84532"], // Base mainnet and Base Sepolia
    }),
  });
}
