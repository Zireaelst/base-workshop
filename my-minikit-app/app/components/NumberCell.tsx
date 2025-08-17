
import React from 'react';

interface NumberCellProps {
  num: number;
  isTaken: boolean;
  isSelected: boolean;
  onClick: (num: number) => void;
}

const NumberCell: React.FC<NumberCellProps> = ({ num, isTaken, isSelected, onClick }) => {
  const getCellClasses = () => {
    if (isSelected) {
      return 'bg-base-purple ring-2 ring-offset-2 ring-offset-base-gray ring-base-purple-light text-white';
    }
    if (isTaken) {
      return 'bg-base-red opacity-50 cursor-not-allowed';
    }
    return 'bg-base-light-gray hover:bg-base-purple-light text-gray-200';
  };

  return (
    <button
      onClick={() => !isTaken && onClick(num)}
      disabled={isTaken}
      className={`w-full aspect-square flex items-center justify-center text-lg font-bold rounded-md transition-all duration-200 transform hover:scale-110 ${getCellClasses()}`}
    >
      {num}
    </button>
  );
};

export default NumberCell;
