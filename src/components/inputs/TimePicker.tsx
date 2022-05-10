import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import styled from 'styled-components';
import Input from './Input';

const Container = styled.div`
  .react-datepicker {
    border: none;
  }
  .react-datepicker-popper {
    border: 1px solid ${p => p.theme.color.grey3};
    padding-top: 0;
    ${p => p.theme.shadows[0]};
  }
  .react-datepicker__time-list-item {
    display: flex;
    align-items: center;
  }
  .react-datepicker__time-list-item--selected {
    background-color: ${p => p.theme.color.primary} !important;
  }
  .react-datepicker__header,
  .react-datepicker__triangle {
    display: none;
  }
`;

interface Props extends ReactDatePickerProps {
  label?: string;
}

const TimePicker: React.FC<Props> = ({ label, ...props }) => {
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
        noMargin
      />
    );
  };

  return (
    <Container>
      <ReactDatePicker
        {...props}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        dateFormat="HH:mm"
        customInput={React.createElement(React.forwardRef(TimeSelectInput))}
      />
    </Container>
  );
};

export default TimePicker;
