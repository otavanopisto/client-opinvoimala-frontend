import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styled from 'styled-components';
import Input from './Input';

const DAY_SIZE = 32;

const Container = styled.div`
  .react-datepicker {
    border: none;
    &__header {
      background-color: transparent;
      border-bottom: none;
    }
    &__current-month {
      font-size: 0.875rem;
      padding-bottom: ${p => p.theme.spacing.md};
    }

    &__header,
    &__day-name {
      text-transform: capitalize;
    }

    &__day,
    &__day-name {
      width: ${DAY_SIZE}px;
      height: ${DAY_SIZE}px;
      line-height: ${DAY_SIZE}px;
    }

    &__day-name {
      width: ${DAY_SIZE}px;
      height: ${DAY_SIZE * 0.5}px;
      line-height: ${DAY_SIZE}px;
      font-size: 0.75rem;
      color: ${p => p.theme.color.secondary};
    }

    &__day {
      width: ${DAY_SIZE}px;
      height: ${DAY_SIZE}px;
      line-height: ${DAY_SIZE}px;
      font-size: 1rem;
      border-radius: 20px;
      color: ${p => p.theme.color.foreground};

      &--highlighted {
        background-color: ${p => p.theme.color.grey3};
      }
      &--selected {
        background-color: ${p => p.theme.color.primary};
        color: ${p => p.theme.color.background};
        font-weight: normal;
      }
      &--disabled {
        opacity: 0.3;
      }
      &--keyboard-selected {
        background-color: transparent;
      }
    }
  }
`;

interface Props extends ReactDatePickerProps {
  label?: string;
}

const DatePicker: React.FC<Props> = ({ label, ...props }) => {
  const TimeSelectInput = (
    { value, onClick }: React.HTMLProps<HTMLInputElement>,
    ref: any
  ) => {
    return (
      <Input
        value={value}
        label={label}
        onClick={onClick}
        size="small"
        icon="clock outline"
        iconPosition="left"
        disabled={props.disabled}
        noMargin
      />
    );
  };

  return (
    <Container>
      <ReactDatePicker
        {...props}
        dateFormat="dd.MM.yyyy"
        customInput={React.createElement(React.forwardRef(TimeSelectInput))}
      />
    </Container>
  );
};

export default DatePicker;
