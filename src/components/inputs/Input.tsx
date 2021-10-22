import React from 'react';
import { Input as SemanticInput, InputProps } from 'semantic-ui-react';
import styled from 'styled-components';

const Container = styled.div<{ labelHidden?: boolean }>`
  margin: ${p => p.theme.spacing.lg} 0;
  label {
    display: ${p => (p.labelHidden ? 'none' : 'initial')};
    .input__label--required {
      display: inline-block;
      margin-left: 2px;
      color: ${p => p.theme.color.accent};
    }
  }
`;

interface Props extends InputProps {
  labelHidden?: boolean;
}

export const Input: React.FC<Props> = ({
  labelHidden = false,
  id,
  size = 'mini',
  label,
  ...props
}) => {
  return (
    <Container labelHidden={labelHidden}>
      {label && (
        <label htmlFor={id}>
          {label}
          {props.required && <span className="input__label--required">*</span>}
        </label>
      )}

      <SemanticInput
        aria-required={props.required}
        {...props}
        size={size}
        fluid
      />
    </Container>
  );
};

export default Input;
