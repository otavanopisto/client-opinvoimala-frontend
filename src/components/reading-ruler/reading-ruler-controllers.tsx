import * as React from 'react';
import Button from '../inputs/Button';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ControllerContainer = styled.div`
  align-items: center;
  background: $color-default;
  border: 1px solid $color-default-separator-border;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  right: 0;
  padding: 0 10px;
  position: fixed;
  z-index: 10010;

  &.open {
    width: 100%;
  }
  > button {
    margin-right: 2px;
    margin-left: 2px;
  }
  .reading-ruler-controllers-tool-button {
    transform: rotate(0deg);
    transition: rotate 0.2s ease;
  }

  .reading-ruler-controllers-tool-button--open {
    transform: rotate(180deg);
    transition: rotate 0.2s ease;
  }

  .reading-ruler-controllers-presets-container,
  .reading-ruler-controllers-settings-container {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    opacity: 0%;
    visibility: hidden;
    width: 0;
  }

  .reading-ruler-controllers-presets-container--open,
  .reading-ruler-controllers-settings-container--open {
    opacity: 100%;
    visibility: visible;
    width: auto;
    > * {
      margin-right: 2px;
      margin-left: 2px;
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    justify-content: flex-end;
    right: 10px;
    padding: 0;
    width: auto;
  }
`;

/**
 * ReadingRulerControllersProps
 */
interface ReadingRulerControllersProps {
  tools: React.ReactNode;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /* presets: React.ReactNode; */
  onClose?: () => void;
}

/**
 * ReadingRulerControllers
 */
export const ReadingRulerControllers = React.forwardRef<
  HTMLDivElement,
  ReadingRulerControllersProps
>((props, ref) => {
  const { tools, onClose, isOpen, setOpen } = props;
  const { t } = useTranslation();

  /**
   * handleShowToolsClick
   * @param e e
   *
   */
  const handleShowToolsClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setOpen(!isOpen);
  };

  return (
    <ControllerContainer
      ref={ref}
      id="rulerController"
      className={`${isOpen ? 'open' : ''}`}
    >
      <Button
        ariaLabel={t('aria.main_navigation')}
        id="openSettings"
        variant="outlined"
        tooltip={isOpen ? t('aria.close_toolbar') : t('aria.open_toolbar')}
        color="secondary"
        icon={isOpen ? 'arrow-right' : 'arrow-left'}
        onClick={handleShowToolsClick}
      />
      <div
        className={`${
          isOpen
            ? 'reading-ruler-controllers-settings-container reading-ruler-controllers-settings-container--open'
            : 'reading-ruler-controllers-settings-container'
        }`}
      >
        {tools}
      </div>
      {onClose && (
        <Button
          ariaLabel={t('aria.close_ruler')}
          id="closeSettings"
          variant="outlined"
          tooltip={t('aria.close_ruler')}
          color="secondary"
          icon="cross"
          onClick={onClose}
        />
      )}
    </ControllerContainer>
  );
});

ReadingRulerControllers.displayName = 'ReadingRulerControllers';
