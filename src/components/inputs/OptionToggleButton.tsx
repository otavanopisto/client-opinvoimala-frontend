import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

type ToggleButtonSize = 'sm' | 'normal';

const ToggleButton = styled.button<{ size: ToggleButtonSize }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-family: ${p => p.theme.font.secondary};
  font-size: ${p => (p.size === 'sm' ? 16 : 20)}px;
  text-align: left;
  margin: ${p => p.theme.spacing.md} 0;
  padding: ${p => (p.size === 'sm' ? p.theme.spacing.md : p.theme.spacing.lg)};
  background-color: ${p => p.theme.color.grey3};
  color: ${p => p.theme.color.secondary};
  border-radius: ${p => p.theme.borderRadius.md};
  cursor: pointer;

  &.is-selected {
    background-color: ${p => p.theme.color.primary};
    color: ${p => p.theme.color.background};
  }

  &.not-selected {
    color: ${p => p.theme.color.secondary};
  }

  :hover:not(.is-selected) {
  }

  .toggle-button__selected-icon {
    position: absolute;
    right: 20px;
  }
`;

interface Props {
  isSelected: boolean;
  autoFocus: boolean;
  onClick: () => void;
  size?: ToggleButtonSize;
}

const OptionToggleButton: React.FC<Props> = ({
  autoFocus,
  isSelected,
  onClick,
  size = 'normal',
  children,
}) => {
  const getClassName = () => {
    return isSelected ? ' is-selected' : ' not-selected';
  };

  const iconSize = size === 'sm' ? 'small' : 'large';

  return (
    <ToggleButton
      aria-pressed={isSelected}
      autoFocus={autoFocus}
      className={getClassName()}
      onClick={onClick}
      size={size}
    >
      <div>{children}</div>
      {isSelected && (
        <div className="toggle-button__selected-icon">
          <Icon name="check" size={iconSize} fitted />
        </div>
      )}
    </ToggleButton>
  );
};

export default OptionToggleButton;
