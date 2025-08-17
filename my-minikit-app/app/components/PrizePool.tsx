
import React, { useState, useEffect } from 'react';

interface PrizePoolProps {
  amount: number;
}

const PrizePool: React.FC<PrizePoolProps> = ({ amount }) => {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (amount !== displayAmount) {
      setIsAnimating(true);
      // Simple animation: quickly count up/down to the new amount
      const diff = amount - displayAmount;
      const duration = 500;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setDisplayAmount(parseFloat((displayAmount + diff * progress).toFixed(4)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayAmount(amount); // Ensure it ends on the exact amount
          setIsAnimating(false);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);


  return (
    <div className="w-full bg-base-gray p-6 rounded-xl shadow-lg text-center animate-pulseScale">
      <p className="text-base-purple-light text-sm uppercase font-semibold tracking-wider">
        Havuzdaki Toplam Ödül
      </p>
      <p className={`text-4xl font-bold text-white mt-2 transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        {displayAmount.toFixed(4)} ETH
      </p>
    </div>
  );
};

export default PrizePool;
