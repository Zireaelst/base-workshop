import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TOMBALA_CONTRACT_CONFIG } from '@/lib/contracts'
import { useChainId } from 'wagmi'
import { parseEther } from 'viem'

// Hook to get game statistics (modified to work with 24-hour game duration)
export function useTombalaGameStats() {
  const chainId = useChainId();
  const contractAddress = TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`;

  const { data: gameId, isLoading: isLoadingGameId } = useReadContract({
    address: contractAddress,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'currentGameId',
    query: { refetchInterval: 5000 },
  });

  const { data: isActive, isLoading: isLoadingIsActive } = useReadContract({
    address: contractAddress,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'isGameActive',
    query: { refetchInterval: 5000 },
  });

  const { data: pot, isLoading: isLoadingPot } = useReadContract({
    address: contractAddress,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'totalPot',
    query: { refetchInterval: 5000 },
  });

  const { data: timeLeft, isLoading: isLoadingTimeLeft } = useReadContract({
    address: contractAddress,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'getRemainingTime',
    query: { refetchInterval: 5000 },
  });

  const isLoading = isLoadingGameId || isLoadingIsActive || isLoadingPot || isLoadingTimeLeft;

  const gameStats =
    gameId !== undefined &&
    isActive !== undefined &&
    pot !== undefined &&
    timeLeft !== undefined
      ? [
          gameId,
          isActive,
          pot,
          BigInt(0), // betsCount placeholder - will be calculated from filledNumbers
          timeLeft,
        ]
      : undefined;

  return { data: gameStats as [bigint, boolean, bigint, bigint, bigint] | undefined, isLoading };
}

// Hook to get filled numbers
export function useTombalaFilledNumbers() {
  const chainId = useChainId()
  
  return useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'getFilledNumbers',
    query: {
      refetchInterval: 3000, // Refetch every 3 seconds
    }
  })
}

// Hook to check if player has bet
export function useTombalaPlayerBetStatus(playerAddress: `0x${string}` | undefined) {
  const chainId = useChainId()
  
  return useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'hasPlayerBet',
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: !!playerAddress,
      refetchInterval: 5000,
    }
  })
}

// Hook to get player's numbers
export function useTombalaPlayerNumbers(playerAddress: `0x${string}` | undefined) {
  const chainId = useChainId()
  
  return useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'getPlayerNumbers',
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: !!playerAddress,
      refetchInterval: 5000,
    }
  })
}

// Hook to get game history
export function useTombalaGameHistory(gameId: bigint) {
  const chainId = useChainId()
  
  return useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'gameHistory',
    args: [gameId],
  })
}

// Hook to place a bet
export function useTombalaPlaceBet() {
  const chainId = useChainId()
  
  const { writeContract, isPending, error, data: hash } = useWriteContract()
  
  const placeBet = (number: number) => {
    writeContract({
      address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
      abi: TOMBALA_CONTRACT_CONFIG.abi,
      functionName: 'placeBet',
      args: [BigInt(number)],
      value: parseEther('0.001'),
    })
  }

  return {
    placeBet,
    isPending,
    error,
    hash,
  }
}

// Hook to wait for transaction confirmation
export function useTombalaTransactionReceipt(hash: `0x${string}` | undefined) {
  return useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    }
  })
}

// Hook to get constants
export function useTombalaConstants() {
  const chainId = useChainId()
  
  const betPrice = useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'BET_PRICE',
  })

  const minNumber = useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'MIN_NUMBER',
  })

  const maxNumber = useReadContract({
    address: TOMBALA_CONTRACT_CONFIG.address[chainId as keyof typeof TOMBALA_CONTRACT_CONFIG.address] as `0x${string}`,
    abi: TOMBALA_CONTRACT_CONFIG.abi,
    functionName: 'MAX_NUMBER',
  })

  return {
    betPrice: betPrice.data,
    minNumber: minNumber.data,
    maxNumber: maxNumber.data,
  }
}
