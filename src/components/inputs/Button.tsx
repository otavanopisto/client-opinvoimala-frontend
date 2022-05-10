import React, { FC } from 'react';
import styled from 'styled-components';
import { Colors } from '../../theme/styled';
import { sendAnalyticsEvent } from '../../utils/analytics';

const StyledButton = styled.button<{
  color: ColorType;
  negativeText: boolean;
  isSmall: boolean;
  noMargin: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${p => (p.isSmall ? undefined : '120px')};
  border-radius: ${p => (p.isSmall ? p.theme.borderRadius.md : '40px')};
  margin: ${p => (p.noMargin ? 0 : p.theme.spacing.sm)} 0;

  padding-top: ${p => (p.isSmall ? p.theme.spacing.sm : p.theme.spacing.md)};
  padding-bottom: ${p => (p.isSmall ? p.theme.spacing.sm : p.theme.spacing.md)};
  padding-left: ${p => p.theme.spacing.lg};
  padding-right: ${p => p.theme.spacing.lg};
  white-space: nowrap;

  > svg,
  > i {
    margin-left: 8px;
    margin-right: 0px;
  }

  &.icon-button {
    padding: ${p => p.theme.spacing.md};
    svg,
    i {
      margin-left: 0;
      margin-right: 0;
    }
  }

  font-family: ${p => p.theme.font.secondary};
  ${p => (p.isSmall ? p.theme.font.size.xs : p.theme.font.size.sm)};
  font-weight: bold;
  user-select: none;
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  :active {
    box-shadow: none;
    opacity: 0.8;
  }

  &.button-filled {
    border: 1px solid ${p => p.theme.color[p.color]};
    background-color: ${p => p.theme.color[p.color]};
    color: ${p =>
      p.negativeText ? p.theme.color.secondary : p.theme.color.background};

    opacity: 1;
    :hover:not(.disabled) {
      opacity: 0.8;
    }
  }

  &.button-outlined {
    background-color: ${p => p.theme.color.primaryLight};
    color: ${p => p.theme.color[p.color]};
    border: 1px solid ${p => p.theme.color[p.color]};

    &.icon-button {
      border-width: 2px;
    }

    opacity: 1;
    :hover {
      opacity: 0.8;
    }
  }

  &.button-link {
    background-color: transparent;
    border: 1px solid transparent;
    color: ${p => p.theme.color[p.color]};
    opacity: 1;
    font-weight: bold;
    :hover:not(.disabled) {
      text-decoration: underline;
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  &.is-hidden {
    visibility: hidden;
  }
`;

type ColorType = keyof Colors;
type VariantType = 'filled' | 'outlined' | 'link';

interface Props {
  id: string;
  text?: string | JSX.Element;
  icon?: JSX.Element;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  type?: 'button' | 'submit' | 'reset';
  color?: ColorType;
  negativeText?: boolean;
  variant?: VariantType;
  disabled?: boolean;
  hidden?: boolean;
  isSmall?: boolean;
  noMargin?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  gaEvent?: {
    name: string;
    variables?: any;
  };
}

export const Button: FC<Props> = ({
  id,
  text,
  icon,
  onClick,
  type = 'button',
  color = 'secondary',
  negativeText = false,
  variant = 'filled',
  disabled,
  hidden = false,
  isSmall = false,
  noMargin = false,
  autoFocus = false,
  ariaLabel,
  gaEvent,
}) => {
  const isIconButton = !!icon && !text;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gaEvent) sendAnalyticsEvent(gaEvent.name, gaEvent.variables);
    if (onClick) onClick(e);
  };

  const getClassName = () => {
    let className = `button-${variant}`;
    className += disabled ? ' disabled' : '';
    className += hidden ? ' is-hidden' : '';
    className += isIconButton ? ' icon-button' : '';
    return className;
  };

  return (
    <StyledButton
      aria-label={ariaLabel}
      id={id}
      data-testid={id}
      type={type}
      onClick={handleClick}
      className={getClassName()}
      disabled={disabled}
      color={color}
      negativeText={negativeText}
      isSmall={isSmall || isIconButton}
      noMargin={noMargin}
      autoFocus={autoFocus}
    >
      {text}
      {icon}
    </StyledButton>
  );
};

export default Button;
