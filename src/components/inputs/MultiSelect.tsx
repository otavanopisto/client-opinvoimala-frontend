import React from 'react';
import OptionToggleButton from './OptionToggleButton';

interface Props<T extends OptionId> {
  options: SelectOption<T>[];
  selectedOption?: SelectOption<T> | null;
  onSelect: (answer: SelectOption<T>) => void;
  autoFocus?: boolean;
}

export function MultiSelect<T extends OptionId>(props: Props<T>) {
  const { options, selectedOption, onSelect, autoFocus } = props;
  return (
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
}

export default MultiSelect;
