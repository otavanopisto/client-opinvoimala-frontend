import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Icon from '../Icon';

type SelectVariant = 'filled' | 'default';

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

const StyledSelect = styled.select<{ variant?: SelectVariant }>`
  width: 100%;
  font-family: ${p => p.theme.font.secondary};
  ${p => {
    switch (p.variant) {
      case 'filled':
        return `
          padding: ${p.theme.spacing.lg};
          border: none;
          border-radius: ${p.theme.borderRadius.md};
          background-color: ${p.theme.color.grey3};
          appearance: none;
          line-height: 150%;
        `;
      default:
        return `
          border: 1px solid rgba(34,36,38,.15);
          padding: ${p.theme.spacing.md};
          border-radius: ${p.theme.borderRadius.sm};
        `;
    }
  }};
`;

interface Props<T extends OptionId> {
  id?: string;
  label?: string;
  options: SelectOption<T>[];
  selectedOption?: SelectOption<T> | null;
  onSelect: (answer?: SelectOption<T> | null) => void;
  autoFocus?: boolean;
  showDefaultOption?: boolean;
  variant?: SelectVariant;
  disabled?: boolean;
}

export function Select<T extends OptionId>(props: Props<T>) {
  const {
    id,
    label,
    options,
    selectedOption,
    onSelect,
    autoFocus = false,
    showDefaultOption = true,
    variant = 'default',
    disabled,
  } = props;
  const { t } = useTranslation();

  const emptyOption = {
    id: -1,
    label: t('action.select'),
  };

  const _options = showDefaultOption ? [emptyOption, ...options] : options;
  const defaultOption = showDefaultOption ? emptyOption.id : undefined;

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const optionId = event.currentTarget.value;
    const option = options.find(({ id }) => `${id}` === optionId);
    onSelect(option ?? null);
  };

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}

      <Container>
        <StyledSelect
          id={id}
          autoFocus={autoFocus}
          value={selectedOption?.id ?? defaultOption}
          onChange={handleSelect}
          variant={variant}
          disabled={disabled}
        >
          {_options.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </StyledSelect>

        {['filled'].includes(variant) && (
          <Icon
            type="ChevronDown"
            color="none"
            strokeColor="secondary"
            width={32}
          />
        )}
      </Container>
    </div>
  );
}

export default Select;
