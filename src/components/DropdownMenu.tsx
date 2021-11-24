import React, { useState } from 'react';
import styled from 'styled-components';
import { LinkIn } from '../store/models';
import { Colors } from '../theme/styled';
import { useOutsideClickAction } from '../utils/hooks';
import Link from './Link';

const StyledDropdownMenu = styled.div<{
  color: keyof Colors;
  verticalPosition: number;
}>`
  display: inline-block;
  position: relative;

  .dropdown {
    &__trigger,
    &__menu {
      a,
      button {
        color: ${p => p.theme.color[p.color]};
        font-family: ${p => p.theme.font.secondary};
        ${p => p.theme.font.size.md};
        font-weight: bold;
        margin-left: ${p => p.theme.spacing.lg};
        margin-right: ${p => p.theme.spacing.lg};
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }

      a:hover,
      button:hover {
        text-decoration: underline;
      }
    }

    &__menu {
      position: absolute;
      top: ${p => 35 + p.verticalPosition}px;
      &.align-right {
        right: 0;
      }
      &.align-left {
        left: 10px;
      }
      background-color: ${p => p.theme.color.background};
      ${p => p.theme.shadows[0]};
      border-radius: ${p => p.theme.borderRadius.sm};
      z-index: 9;
      width: 230px;

      transition: all 0.4s ease-in-out;

      max-height: 0;
      opacity: 0;
      &.is-open {
        max-height: 1000px;
        opacity: 1;
      }

      a {
        display: block;
        padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
        margin: 0;
        font-weight: normal;
      }
    }
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

  items: LinkIn[];
  align?: 'left' | 'right';
  verticalPosition?: number;
}

const DropdownMenu: React.FC<Props> = ({
  color = 'secondary',
  triggerButton,
  triggerEl,
  items,
  align = 'left',
  verticalPosition = 0,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref: React.RefObject<HTMLDivElement> = React.createRef();

  useOutsideClickAction({
    ref,
    condition: isOpen,
    action: () => setIsOpen(false),
  });

  const toggleMenu = () => {
    if (items?.length) setIsOpen(!isOpen);
  };

  const renderTrigger = () => {
    if (triggerEl) return triggerEl(isOpen, toggleMenu);
    if (triggerButton) {
      const { label } = triggerButton;
      if (label)
        return (
          <button aria-expanded={isOpen} aria-haspopup={true}>
            {label}
          </button>
        );
    }
    return null;
  };

  const getMenuClassName = () => {
    let className = 'dropdown__menu';
    className += ` align-${align}`;
    if (isOpen) className += ' is-open';
    return className;
  };

  if (!items?.length) {
    return null;
  }

  return (
    <StyledDropdownMenu
      color={color}
      onClick={toggleMenu}
      ref={ref}
      verticalPosition={verticalPosition}
      {...rest}
    >
      <div className="dropdown__trigger">{renderTrigger()}</div>
      <div aria-hidden={!isOpen} className={getMenuClassName()}>
        {isOpen &&
          items.map(link => (
            <Link key={link.id} link={link}>
              {link.label}
            </Link>
          ))}
      </div>
    </StyledDropdownMenu>
  );
};

export default DropdownMenu;
