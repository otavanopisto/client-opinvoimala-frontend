import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Icon from '../Icon';

const Container = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    top: 18px;
    right: 24px;
    pointer-events: none;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: ${p => p.theme.spacing.lg};
  border: none;
  border-radius: ${p => p.theme.borderRadius.md};
  background-color: ${p => p.theme.color.grey3};
  appearance: none;

  color: ${p => p.theme.color.secondary};
  font-family: ${p => p.theme.font.secondary};
  line-height: 150%;
`;

interface Props {
  options: SelectOption[];
  selectedOption?: SelectOption | null;
  onSelect: (answer?: SelectOption | null) => void;
  autoFocus?: boolean;
}

export const Select: React.FC<Props> = ({
  options,
  selectedOption,
  onSelect,
  autoFocus = false,
}) => {
  const { t } = useTranslation();

  const emptyOption = {
    id: -1,
    label: t('action.select'),
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionId = Number(event.currentTarget.value);
    const option = options.find(({ id }) => id === optionId);
    onSelect(option ?? null);
  };

  return (
    <Container>
      <StyledSelect
        autoFocus={autoFocus}
        value={selectedOption?.id}
        onChange={handleSelect}
      >
        {[emptyOption, ...options].map(option => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </StyledSelect>

      <Icon
        type="ChevronDown"
        color="none"
        strokeColor="secondary"
        width={32}
      />
    </Container>
  );
};

export default Select;
