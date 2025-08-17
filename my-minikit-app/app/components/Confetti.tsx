
import React from 'react';

const Confetti: React.FC = () => {
  const confettiCount = 50;
  const colors = ['#6366F1', '#818CF8', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationName: 'confettiFall',
          animationDuration: `${Math.random() * 2 + 3}s`, // 3 to 5 seconds
          animationDelay: `${Math.random() * 2}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        };
        const size = Math.random() * 8 + 4; // 4px to 12px
        
        return (
          <div
            key={i}
            className="absolute top-0"
            style={{ ...style, width: `${size}px`, height: `${size}px` }}
          />
        );
      })}
    </div>
  );
};

export default Confetti;
