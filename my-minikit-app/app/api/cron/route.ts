import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, createWalletClient, http, getContract } from 'viem';
import { baseSepolia, base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { TOMBALA_CONTRACT_CONFIG } from '@/lib/contracts';

export async function GET(request: NextRequest) {
  try {
    // Verify cron job secret to prevent unauthorized calls
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json({ error: 'Private key not configured' }, { status: 400 });
    }

    // Create clients
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    // Get contract instance
    const contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: TOMBALA_CONTRACT_CONFIG.abi,
      client: { public: publicClient, wallet: walletClient },
    });

    // Check if game is active
    const isGameActive = await contract.read.isGameActive();
    
    if (isGameActive) {
      return NextResponse.json({ 
        message: 'Game is still active, no draw needed',
        gameActive: true 
      });
    }

    // Check if there are any bets to draw from
    const filledNumbers = await contract.read.getFilledNumbers() as unknown as bigint[];
    
    if (filledNumbers.length === 0) {
      // No bets placed, but we still need to draw to reset the game
      // The smart contract will automatically start a new game after drawing
      const hash = await contract.write.drawWinner();
      
      return NextResponse.json({
        message: 'No bets placed, drew and started new game',
        transactionHash: hash,
        gameActive: false,
        betsCount: 0
      });
    }

    // Draw winner - this will automatically start a new game
    const drawHash = await contract.write.drawWinner();

    return NextResponse.json({
      message: 'Successfully drew winner and started new game',
      transactionHash: drawHash,
      betsCount: filledNumbers.length,
      network: chain.name
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also handle POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
