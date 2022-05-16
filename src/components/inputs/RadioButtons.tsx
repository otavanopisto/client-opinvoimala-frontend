import React from 'react';
import { CheckboxProps, Radio } from 'semantic-ui-react';
import styled from 'styled-components';

const Container = styled.div`
  .checkbox {
    margin: ${p => p.theme.spacing.sm} 0;
    label {
      line-height: inherit !important;
    }
  }
`;

interface RadioOption {
  value: string;
  label: string;
}

interface Props {
  groupName: string;
  selected: string;
  options: RadioOption[];
  onChange: (
    event: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ) => void;
}

export const RadioButtons: React.FC<Props> = ({
  groupName,
  selected,
  options,
  onChange,
}) => (
  <Container>
    {options.map(({ value, label }) => (
      <Radio
        key={value}
        label={label}
        name={groupName}
        value={value}
        checked={value === selected}
        onChange={onChange}
      />
    ))}
  </Container>
);

export default RadioButtons;
