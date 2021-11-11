import React from 'react';
import { QuestionOption } from '../../store/models';
import OptionToggleButton from './OptionToggleButton';

interface Props {
  options: QuestionOption[];
  selectedOption?: QuestionOption | null;
  onSelect: (answer: QuestionOption) => void;
}

const MultiSelect: React.FC<Props> = ({
  options,
  selectedOption,
  onSelect,
}) => (
  <div>
    {options.map((option, i) => (
      <OptionToggleButton
        key={option.id}
        isSelected={selectedOption?.id === option.id}
        autoFocus={i === 0}
        onClick={() => onSelect(option)}
      >
        {option.label}
      </OptionToggleButton>
    ))}
  </div>
);

export default MultiSelect;
