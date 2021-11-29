import React, { createRef, RefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useOutsideClickAction } from '../utils/hooks';
import Icon from './Icon';
import Button from './inputs/Button';

const DrawerContainer = styled.aside<{ isOpen: boolean; fullWidth?: boolean }>`
  z-index: 9;
  position: fixed;
  top: 0;
  padding: ${p => p.theme.spacing.lg};
  background-color: ${p => p.theme.color.background};
  ${p => p.theme.shadows[0]};
  overflow-y: auto;

  opacity: ${p => (p.isOpen ? 1 : 0)};

  height: 100vh;
  width: 40vw;
  right: ${p => (p.isOpen ? 0 : -60)}vw;
  @media ${p => p.theme.breakpoint.tablet} {
    width: 60vw;
    right: ${p => (p.isOpen ? 0 : -80)}vw;
  }
  @media ${p => p.theme.breakpoint.mobile} {
    width: ${p => (p.fullWidth ? 100 : 80)}vw;
    right: ${p => (p.isOpen ? 0 : -100)}vw;
  }

  transition: all 0.3s cubic-bezier(0.82, 0.085, 0.395, 0.895);

  .drawer__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 50px;
  }

  .drawer__main-content {
    ul.drawer__link-list {
      list-style-type: none;
      padding: 0;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        a,
        span,
        button {
          text-align: left;
          display: block;
          padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
          color: ${p => p.theme.color.secondary};
          ${p => p.theme.font.size.xl};
          font-family: ${p => p.theme.font.secondary};
          user-select: none;
        }
        a,
        span,
        button {
          cursor: pointer;
          text-decoration: none;
          :hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;
type OnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
type RefType = RefObject<HTMLDivElement>;

interface Props {
  // If drawer's content needs access to the drawer ref and close method,
  // use the following content prop, otherwise set content as a children.
  content?: (ref: RefType, onClose: () => void) => JSX.Element;
  triggerEl: (isOpen: boolean, onClick: OnClick) => JSX.Element;
  fullWidth?: boolean;
}

const Drawer: React.FC<Props> = ({
  content,
  triggerEl,
  fullWidth,
  children,
}) => {
  const { t } = useTranslation();
  const ref: RefType = createRef();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useOutsideClickAction({
    ref,
    condition: isOpen,
    action: () => setIsOpen(false),
  });

  useEffect(() => {
    const unlistenHistory = history.listen(() => {
      // Route changed, close drawer:
      setIsOpen(false);
    });

    return () => unlistenHistory();
  }, [history]);

  return (
    <div>
      <div>{triggerEl(isOpen, toggleDrawer)}</div>
      <DrawerContainer ref={ref} isOpen={isOpen} fullWidth={fullWidth}>
        <section aria-label="aside content" aria-hidden={!isOpen}>
          <header className="drawer__header">
            <div>
              <Button
                ariaLabel={t('aria.close')}
                id="drawer__close-button"
                variant="filled"
                icon={<Icon type="Close" color="background" />}
                onClick={toggleDrawer}
                noMargin
              />
            </div>
          </header>
          <main className="drawer__main-content">
            {content ? content(ref, toggleDrawer) : children}
          </main>
        </section>
      </DrawerContainer>
    </div>
  );
};

export default Drawer;
