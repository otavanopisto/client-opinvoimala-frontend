import React from 'react';
import { Input as SemanticInput, InputProps } from 'semantic-ui-react';
import styled from 'styled-components';

const Container = styled.div<{ labelHidden?: boolean; noMargin?: boolean }>`
  margin: ${p => (p.noMargin ? 0 : p.theme.spacing.lg)} 0;
  text-align: left;
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
  noMargin?: boolean;
}

export const Input: React.FC<Props> = ({
  labelHidden = false,
  noMargin,
  id,
  size = 'mini',
  label,
  ...props
}) => {
  return (
    <Container labelHidden={labelHidden} noMargin={noMargin}>
      {label && (
        <label htmlFor={id} aria-required={props.required}>
          {label}
          {props.required && <span className="input__label--required">*</span>}
        </label>
      )}

      <SemanticInput
        id={id}
        aria-required={props.required}
        {...props}
        size={size}
        fluid
      />
    </Container>
  );
};

export default Input;
