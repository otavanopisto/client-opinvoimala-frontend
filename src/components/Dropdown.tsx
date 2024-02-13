import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colors } from '../theme/styled';
import { useOutsideClickAction } from '../utils/hooks/useOutsideClickAction';
import Icon from './Icon';
import { createPortal } from 'react-dom';

const StyledDropdownMenu = styled.div<{
  color: keyof Colors;
  verticalPosition: number;
  menuWidth?: number;
}>`
  .dropdown {
    &__trigger,
    &__menu {
      a,
      button {
        color: ${p => p.theme.color[p.color]};
        font-family: ${p => p.theme.font.secondary};
        ${p => p.theme.font.size.sm};
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }

      a:hover,
      button:hover {
        text-decoration: underline;
      }
    }
  }
`;

const DropdownMenu = styled.div<{
  color: keyof Colors;
  verticalPosition: number;
  menuWidth?: number;
}>`
  padding: 0;
  margin: 0;
  // position: absolute;
  // top: ${p => 35 + p.verticalPosition}px;
  &.align-right {
    right: 0;
  }
  &.align-left {
    left: 10px;
  }
  background-color: ${p => p.theme.color.background};
  ${p => p.theme.shadows[0]};
  border-radius: ${p => p.theme.borderRadius.sm};
  z-index: 10011;
  width: ${p => p.menuWidth ?? 230}px;

  transition: all 0.4s ease-in-out;

  max-height: 0;
  opacity: 0;
  &.is-open {
    max-height: 1000px;
    opacity: 1;
  }

  &.is-hidden {
    display: none;
  }

  a,
  .link {
    display: block;
    padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
    margin: 0;
    font-weight: normal;
  }
`;

const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  svg {
    margin-left: ${p => p.theme.spacing.md};
  }
`;

type OnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

interface Props {
  color?: keyof Colors;
  triggerButton?: {
    label: string;
  };
  // Optional trigger element (e.g. Button) to toggle menu open
  // (Will override possible label & url props above)
  triggerEl?: (isOpen: boolean, onClick: OnClick) => JSX.Element;
  executeOnToggle?: (state: boolean) => void;
  disableOutsideClick?: boolean;
  closeOnMenuClick?: boolean;
  children: React.ReactNode;
  align?: 'left' | 'right';
  verticalPosition?: number;
  showArrow?: boolean;
  menuWidth?: number;
}

const Dropdown: React.FC<Props> = ({
  color = 'secondary',
  triggerButton,
  triggerEl,
  executeOnToggle,
  closeOnMenuClick = true,
  disableOutsideClick = false,
  children,
  align = 'left',
  verticalPosition = 0,
  showArrow,
  menuWidth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref: React.RefObject<HTMLDivElement> = React.createRef();
  const triggerRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [triggerPosition, setTriggerPosition] = useState({ top: 0, left: 0 });

  useOutsideClickAction({
    ref,
    condition: isOpen,
    disabled: disableOutsideClick,
    action: () => setIsOpen(false),
  });

  const toggleMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef?.current.getBoundingClientRect();
      setTriggerPosition({
        top: rect.top,
        left: rect.left,
      });
    }
    executeOnToggle && executeOnToggle(!isOpen);
    setIsOpen(!isOpen);
  };

  const renderTrigger = () => {
    if (triggerEl) return triggerEl(isOpen, toggleMenu);
    if (triggerButton) {
      const { label } = triggerButton;
      if (label)
        return (
          <TriggerButton
            type="button"
            aria-expanded={isOpen}
            aria-haspopup={true}
          >
            {label}
            {showArrow && (
              <Icon type={isOpen ? 'ChevronUp' : 'ChevronDown'} color="none" />
            )}
          </TriggerButton>
        );
    }
    return null;
  };

  const getClassName = () => {
    let className = 'menu';
    className += ` align-${align}`;
    if (isOpen) className += ' is-open';
    else className += ' is-hidden';
    return className;
  };

  const handleClick = closeOnMenuClick ? toggleMenu : undefined;

  return (
    <StyledDropdownMenu
      color={color}
      onClick={handleClick}
      ref={ref}
      verticalPosition={verticalPosition}
      menuWidth={menuWidth}
    >
      <div ref={triggerRef} className="dropdown__trigger">
        {renderTrigger()}
      </div>
      {createPortal(
        <DropdownMenu
          color={color}
          verticalPosition={verticalPosition}
          menuWidth={menuWidth}
          style={{
            position: 'fixed',
            top: triggerPosition.top + 45,
            left: triggerPosition.left - 160,
          }}
          className={getClassName()}
        >
          {children}
        </DropdownMenu>,
        document.body
      )}
    </StyledDropdownMenu>
  );
};

export default Dropdown;
