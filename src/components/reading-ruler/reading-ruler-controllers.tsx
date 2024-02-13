import * as React from 'react';
import Button from '../inputs/Button';
// import { IconButton } from '~/components/general/button';
// import Dropdown from '../../general/dropdown';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ControllerContainer = styled.div`
  align-items: center;
  background: $color-default;
  border: 1px solid $color-default-separator-border;
  border-radius: 20px;
  display: inline-flex;
  justify-content: flex-end;
  min-width: 0;
  position: fixed;
  right: 40px;
  width: auto;
  z-index: 10010;

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
    > div {
      margin-right: 2px;
      margin-left: 2px;
    }
  }
`;

/**
 * ReadingRulerControllersProps
 */
interface ReadingRulerControllersProps {
  tools: React.ReactNode;
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
  const { tools, onClose } = props;
  const [toolsDrawerOpen, setToolsDrawerOpen] = React.useState(false);
  const { t } = useTranslation();

  /**
   * handleShowToolsClick
   * @param e e
   */
  const handleShowToolsClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setToolsDrawerOpen(!toolsDrawerOpen);
  };

  return (
    <ControllerContainer ref={ref} className="reading-ruler-controllers">
      <Button
        ariaLabel={t('aria.main_navigation')}
        id="navigation-menu__button"
        variant="outlined"
        tooltip={
          toolsDrawerOpen ? t('aria.close_toolbar') : t('aria.open_toolbar')
        }
        color="secondary"
        icon={toolsDrawerOpen ? 'arrow-right' : 'arrow-left'}
        onClick={handleShowToolsClick}
      />
      <div
        className={`${
          toolsDrawerOpen
            ? 'reading-ruler-controllers-settings-container reading-ruler-controllers-settings-container--open'
            : 'reading-ruler-controllers-settings-container'
        }`}
      >
        {tools}
      </div>
      {onClose && (
        <Button
          ariaLabel={t('aria.close_ruler')}
          id="navigation-menu__button"
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
