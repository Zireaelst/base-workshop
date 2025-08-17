import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia, base } from 'viem/chains';
import { TOMBALA_CONTRACT_CONFIG } from '@/lib/contracts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 games

    // Determine which network to use
    const isDevelopment = process.env.NODE_ENV === 'development';
    const chain = isDevelopment ? baseSepolia : base;
    const contractAddress = isDevelopment 
      ? process.env.NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_SEPOLIA
      : process.env.NEXT_PUBLIC_TOMBALA_CONTRACT_ADDRESS_MAINNET;

    if (!contractAddress) {
      return NextResponse.json({ 
        error: 'Contract address not configured',
        network: chain.name 
      }, { status: 400 });
    }

    // Create public client
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    if (gameId) {
      // Get specific game history
      try {
        const gameHistory = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: TOMBALA_CONTRACT_CONFIG.abi,
          functionName: 'gameHistory',
          args: [BigInt(gameId)],
        });

        return NextResponse.json({
          game: gameHistory,
          network: chain.name
        });
      } catch {
        return NextResponse.json({ 
          error: 'Game not found',
          gameId: gameId 
        }, { status: 404 });
      }
    } else {
      // Get current game ID first
      const currentGameId = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: TOMBALA_CONTRACT_CONFIG.abi,
        functionName: 'currentGameId',
      }) as bigint;

      const games = [];
      const startId = Math.max(1, Number(currentGameId) - limit + 1);

      // Fetch multiple games
      for (let i = startId; i < Number(currentGameId); i++) {
        try {
          const gameHistory = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: TOMBALA_CONTRACT_CONFIG.abi,
            functionName: 'gameHistory',
            args: [BigInt(i)],
          });

          // Only include games that have been completed (have a winner)
          const gameRecord = gameHistory as [bigint, bigint, string, bigint, bigint, bigint];
          if (gameHistory && gameRecord[2] !== '0x0000000000000000000000000000000000000000') {
            games.push({
              gameId: i,
              ...gameHistory
            });
          }
        } catch {
          // Skip games that don't exist or haven't been completed
          continue;
        }
      }

      return NextResponse.json({
        games: games.reverse(), // Most recent first
        totalGames: games.length,
        currentGameId: Number(currentGameId),
        network: chain.name
      });
    }

  } catch (error) {
    console.error('Game history API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
