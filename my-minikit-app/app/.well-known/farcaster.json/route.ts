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
  const URL = "https://base-workshop-dluichko1-zireaelsts-projects.vercel.app";

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: "Base Tombala",
      subtitle: "Decentralized Turkish Bingo",
      description: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
      screenshotUrls: [],
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#0f0f0f",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "games",
      tags: ["tombala", "bingo", "web3", "base"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Decentralized Turkish Bingo on Base",
      ogTitle: "Base Tombala - Decentralized Turkish Bingo",
      ogDescription: "Win ETH by betting on numbers 1-25 in this decentralized Turkish Bingo game on Base blockchain!",
      ogImageUrl: `${URL}/hero.png`,
    }),
  });
}
