import React, { useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../theme/styled';
import { useOutsideClickAction } from '../utils/hooks/useOutsideClickAction';
import Icon from './Icon';
import Link, { LinkItem } from './Link';

const StyledDropdownMenu = styled.div<{
  color: keyof Colors;
  verticalPosition: number;
  menuWidth?: number;
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
        ${p => p.theme.font.size.sm};
        font-weight: bold;
        margin-left: ${p => p.theme.spacing.md};
        margin-right: ${p => p.theme.spacing.md};
        cursor: pointer;
        user-select: none;
        text-decoration: none;
        @media ${p => p.theme.breakpoint.laptop} {
          margin-left: ${p => p.theme.spacing.sm};
          margin-right: ${p => p.theme.spacing.sm};
        }
      }

      a:hover,
      button:hover {
        text-decoration: underline;
      }
    }

    &__menu {
      list-style-type: none;
      padding: 0;
      margin: 0;
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
    }
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

  items: LinkItem[];
  align?: 'left' | 'right';
  verticalPosition?: number;
  showArrow?: boolean;
  menuWidth?: number;
}

const DropdownMenu: React.FC<Props> = ({
  color = 'secondary',
  triggerButton,
  triggerEl,
  items,
  align = 'left',
  verticalPosition = 0,
  showArrow,
  menuWidth,
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

  const getMenuClassName = () => {
    let className = 'dropdown__menu';
    className += ` align-${align}`;
    if (isOpen) className += ' is-open';
    else className += ' is-hidden';
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
      menuWidth={menuWidth}
    >
      <div className="dropdown__trigger">{renderTrigger()}</div>
      <ul aria-hidden={!isOpen} className={getMenuClassName()}>
        {items.map(link => (
          <li key={link.id}>
            <Link link={link} label={link.label} />
          </li>
        ))}
      </ul>
    </StyledDropdownMenu>
  );
};

export default DropdownMenu;
