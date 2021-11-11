import React from 'react';
import OptionToggleButton from './OptionToggleButton';

interface Option {
  id: number;
  label: string;
}

interface Props {
  options: Option[];
  selectedOption?: Option | null;
  onSelect: (answer: Option) => void;
  autoFocus?: boolean;
}

export const MultiSelect: React.FC<Props> = ({
  options,
  selectedOption,
  onSelect,
  autoFocus,
}) => (
  <div>
    {options.map((option, i) => (
      <OptionToggleButton
        key={option.id}
        isSelected={selectedOption?.id === option.id}
        autoFocus={!!autoFocus && i === 0}
        onClick={() => onSelect(option)}
      >
        {option.label}
      </OptionToggleButton>
    ))}
  </div>
);

export default MultiSelect;
