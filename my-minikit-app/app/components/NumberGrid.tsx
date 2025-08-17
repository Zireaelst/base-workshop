
import React from 'react';
import { NumberCellData } from '@/lib/types';
import NumberCell from './NumberCell';

interface NumberGridProps {
  numbers: NumberCellData[];
  selectedNumber: number | null;
  onSelect: (num: number) => void;
}

const NumberGrid: React.FC<NumberGridProps> = ({ numbers, selectedNumber, onSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-3 w-full p-4 bg-gray-800 rounded-lg">
      {numbers.map((cellData) => (
        <NumberCell
          key={cellData.num}
          num={cellData.num}
          isTaken={!!cellData.owner}
          isSelected={selectedNumber === cellData.num}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};

export default NumberGrid;
