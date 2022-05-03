import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledTextArea = styled.textarea<{ variant?: 'filled' | 'outlined' }>`
  width: 100%;
  padding: ${p => p.theme.spacing.md};
  line-height: 150%;

  ${p => {
    switch (p.variant) {
      case 'outlined':
        return `border: solid;
                border-color: ${p.theme.color.grey};
                border-width: 1px;
                border-radius: ${p.theme.borderRadius.sm};
                background-color: ${p.theme.color.background};
                resize: vertical;
        `;
      default:
        return `border: none;
                border-radius: ${p.theme.borderRadius.md};
                background-color: ${p.theme.color.grey3};
`;
    }
  }}
`;

interface Props {
  id: number;
  text: string;
  onChange: (text: string) => void;
  rows?: number;
  autoFocus?: boolean;
  placeholder?: string;
  variant?: 'filled' | 'outlined';
}

export const TextArea: React.FC<Props> = ({
  id,
  text,
  onChange,
  rows = 6,
  autoFocus = false,
  placeholder,
  variant = 'filled',
}) => {
  const idRef = useRef<number>();
  const [value, setValue] = useState<string>(text);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
  };

  useEffect(() => {
    if (id !== idRef.current) {
      // ID has changed, clear internal state
      idRef.current = id;
      setValue(text);
    }
  }, [id, text]);

  /**
   * Set the actual text value after a short delay
   * instead of setting it right after each change,
   * which would cause some lagging during typing.
   */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text !== value) onChange(value);
    }, 250);

    return () => clearTimeout(delay);
  }, [onChange, text, value]);

  return (
    <StyledTextArea
      value={value}
      onChange={handleTextChange}
      rows={rows}
      autoFocus={autoFocus}
      placeholder={placeholder}
      variant={variant}
    />
  );
};

export default TextArea;
