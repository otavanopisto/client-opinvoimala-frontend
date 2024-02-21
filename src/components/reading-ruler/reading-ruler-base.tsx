import * as React from 'react';
import { ChromePicker, RGBColor } from 'react-color';
import Dropdown from '../Dropdown';
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';
import { useLocalStorage } from 'usehooks-ts';
// import '~/sass/elements/reading-ruler.scss';
import Button from '../inputs/Button';
// import Dropdown from '../../general/dropdown';

import { ReadingRulerControllers } from './reading-ruler-controllers';

import useIsAtBreakpoint from '../../utils/hooks/useIsAtBreakpoint';
import { BREAKPOINTS } from '../../theme';

import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/storeContext';

const ReadingRulerContainer = styled.div<{ active: boolean }>`
  display: ${p => (p.active ? 'block' : 'none')};
  height: 100vh;
  position: fixed;
  width: 100%;
  z-index: 9999;

  .reading-ruler-top,
  .reading-ruler-middle,
  .reading-ruler-bottom,
  .reading-ruler-dragger-handle-container {
    // background: $color-category-11;
    height: 100px;
    left: 0;
    opacity: 50%;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10000;

    &--inverted {
      background: none;
    }
  }

  .reading-ruler-middle {
    align-items: center;
    background: unset;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    opacity: 100%;

    &--inverted {
      opacity: 50%;
    }
  }

  .reading-ruler-dragger-handle-container {
    align-items: center;
    background: unset;
    bottom: 0;
    display: flex;
    height: 20px;
    justify-content: center;
    top: auto;
  }

  .reading-ruler-middle-mobile-handle {
    background-color: ${p => p.theme.color.grey3};
    border-radius: 25px;
    height: inherit;
    opacity: 70%;
    width: 200px;

    @media ${p => p.theme.breakpoint.laptop} {
      display: none;
    }
  }
  .reading-ruler-bottom {
    bottom: 0;
    top: auto;
  }
`;

export type ReadingRulerNameType =
  | 'default1'
  | 'default2'
  | 'default3'
  | 'custom';

/**
 * ReadingRulerProps
 */
interface ReadingRulerProps {
  active: boolean;
  onClose?: () => void;
}

/**
 * ReadingRulerDefaultProps
 */
export interface ReadingRulerDefaultProps {
  defaultRulerHeight?: number;
  defaultInverted?: boolean;
}

const defaultProps: ReadingRulerDefaultProps = {
  defaultRulerHeight: 10,
  defaultInverted: false,
};

/**
 * ReadingRulerPresetSettings
 */
interface ReadingRulerPresetSettings {
  rulerHeight: number;
  invert: boolean;
  overlayClickActive: boolean;
  backgroundColorRGBA: RGBColor | undefined;
}

/**
 * ReadingRulerState
 */
interface ReadingRulerState {
  activePreset: ReadingRulerNameType;
  activePresetSettings: ReadingRulerPresetSettings;
  customPresetSettings: ReadingRulerPresetSettings;
}

/**
 * readingRulerPresetCustom
 */
const readingRulerPresetCustom: Partial<ReadingRulerPresetSettings> = {
  rulerHeight: defaultProps.defaultRulerHeight,
  invert: defaultProps.defaultInverted,
  overlayClickActive: false,
  backgroundColorRGBA: {
    r: 0,
    g: 0,
    b: 0,
    a: 0.5,
  },
};

/**
 * readingRulerPresetDefault1
 */
const readingRulerPresetDefault1: Partial<ReadingRulerPresetSettings> = {
  rulerHeight: 10,
  invert: defaultProps.defaultInverted,
  overlayClickActive: false,
  backgroundColorRGBA: {
    r: 0,
    g: 0,
    b: 0,
    a: 0.5,
  },
};

/**
 * readingRulerPresetDefault2
 */
// const readingRulerPresetDefault2: Partial<ReadingRulerPresetSettings> = {
//   rulerHeight: 10,
//   invert: defaultProps.defaultInverted,
//   overlayClickActive: true,
//   backgroundColor: "#1dafdd",
// };

/**
 * readingRulerPresetDefault3
 */
// const readingRulerPresetDefault3: Partial<ReadingRulerPresetSettings> = {
//   rulerHeight: 10,
//   invert: defaultProps.defaultInverted,
//   overlayClickActive: true,
//   backgroundColor: "#dd1daf",
// };

/**
 * Reading ruler component
 * @param props props
 * @returns JSX.Element
 */
export const ReadingRulerBase: React.FC<ReadingRulerProps> = observer(props => {
  props = { ...defaultProps, ...props };
  const { onClose, active } = props;

  // States
  const [cursorLocation, setCursorLocation] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [lastEventTarget, setLastEventTarget] =
    React.useState<EventTarget | null>(null);
  const [stopped, setStopped] = React.useState(false);
  const { t } = useTranslation();
  const {
    ruler: { paletteOpen, setPaletteOpen },
  } = useStore();

  // Localstorage stuff
  const [readingRulerState, setReadingRulerState] =
    useLocalStorage<ReadingRulerState>('reading-ruler-settings', {
      activePreset: 'default1',
      activePresetSettings: {
        ...readingRulerPresetDefault1,
      },
      customPresetSettings: {
        ...readingRulerPresetCustom,
      },
    } as ReadingRulerState);

  const mobileBreakpoint = useIsAtBreakpoint(BREAKPOINTS.mobile / 16);
  const tabletBreakpoint = useIsAtBreakpoint(BREAKPOINTS.tablet / 16);

  const top = React.useRef<HTMLDivElement>(null);
  const middle = React.useRef<HTMLDivElement>(null);
  const bottom = React.useRef<HTMLDivElement>(null);
  const dragger = React.useRef<HTMLDivElement>(null);
  const controllers = React.useRef<HTMLDivElement>(null);

  const { activePreset, activePresetSettings, customPresetSettings } =
    readingRulerState;

  const { rulerHeight, invert, overlayClickActive, backgroundColorRGBA } =
    activePresetSettings;

  React.useEffect(() => {
    /**
     * handleTouchMove
     * @param event event
     */
    const handleTouchMove = (event: TouchEvent) => {
      event.stopPropagation();

      if (isDragging === true && !stopped && event.touches[0].clientY) {
        const location =
          event.touches[0].clientY < 0 ? 0 : event.touches[0].clientY;

        setCursorLocation(location);
      }
    };

    /**
     * handleTouchEnd
     * @param event event
     */
    const handleTouchEnd = (event: TouchEvent) => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, stopped, lastEventTarget]);

  React.useEffect(() => {
    // Event is throttled to work max 16ms intervals
    // It is so setState is not called too many times
    const throttleEvent = throttle((e: MouseEvent) => {
      if (!pinned && !stopped) {
        setLastEventTarget(e.target);
        if (isDragging) {
          unstable_batchedUpdates(() => {
            setIsDragging(false);
            setCursorLocation(e.clientY);
          });
        } else {
          setCursorLocation(e.clientY);
        }
      }
    }, 16);

    const handleMouseMove = throttleEvent;

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pinned, stopped, isDragging]);

  React.useLayoutEffect(() => {
    if (active) {
      const rulerStartPoint = window.innerHeight / 2;

      setCursorLocation(rulerStartPoint);
    }
  }, [active]);

  React.useLayoutEffect(() => {
    if (isDragging) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }

    /**
     * updateRulerDimensions
     */

    const updateRulerDimensions = () => {
      if (
        top &&
        top.current &&
        middle &&
        middle.current &&
        bottom &&
        bottom.current &&
        dragger &&
        dragger.current &&
        controllers &&
        controllers.current
      ) {
        let cursorOffset = cursorLocation;
        let target = lastEventTarget as HTMLElement;

        // Check if the touch is inside the settings controller.

        let controllerClick =
          target?.parentNode instanceof HTMLElement &&
          !!target.closest('#rulerController');

        let paletteClick =
          target?.parentNode instanceof HTMLElement &&
          !!target.closest('#colorPicker');

        // If it is, we don't want the ruler to run away.
        if (tabletBreakpoint && !controllerClick && !paletteClick) {
          cursorOffset =
            cursorLocation -
            dragger.current.offsetHeight / 2 -
            (window.innerHeight * (rulerHeight / 100)) / 2;
        }

        // Controller top position is always this, Middle of screen
        controllers.current.style.top = `${
          cursorOffset - controllers.current.offsetHeight / 2
        }px`;

        middle.current.style.top = `calc(${cursorOffset}px - ${
          rulerHeight / 2
        }%)`;

        // Elements heights
        top.current.style.height = `calc(${cursorOffset}px - ${
          rulerHeight / 2
        }%)`;
        middle.current.style.height = `${rulerHeight}%`;
        bottom.current.style.height = `calc(100% - (${cursorOffset}px - ${
          rulerHeight / 2
        }%) - ${rulerHeight}%)`;

        // Dragger
        dragger.current.style.top = `calc(${cursorOffset}px + ${
          rulerHeight / 2
        }%)`;

        if (overlayClickActive) {
          // Middle element width set to 0, so area is clickable
          middle.current.style.width = '5px';
          // Top
          top.current.style.marginBottom = `${rulerHeight / 2}%`;
          // Bottom
          bottom.current.style.marginTop = `${rulerHeight / 2}%`;
        } else {
          // Margins set to 0, so they won't interfere with middle element
          top.current.style.margin = '0';
          bottom.current.style.margin = '0';
          // Middle element width set to 100%, so area is not clickable
          middle.current.style.width = '100%';
        }

        // Because previous version did have possibility to value to be string (hex)
        // and after latest update it is always RGBColor type.
        // These are default values if backgroundColorRGBA is string. In this case its coming as undefined
        // from localstorage
        let redValue = 0;
        let greenValue = 0;
        let blueValue = 0;
        let alphaValue: number | undefined = 0.5;

        if (backgroundColorRGBA) {
          redValue = backgroundColorRGBA.r;
          greenValue = backgroundColorRGBA.g;
          blueValue = backgroundColorRGBA.b;
          alphaValue = backgroundColorRGBA.a;
        }

        // Background color changes and invert settings
        if (!overlayClickActive && invert) {
          top.current.style.background = 'unset';
          middle.current.style.background = `rgba(${redValue}, ${greenValue}, ${blueValue} , ${alphaValue})`;
          bottom.current.style.background = 'unset';
        } else {
          top.current.style.background = `rgba(${redValue}, ${greenValue}, ${blueValue} , ${alphaValue})`;
          middle.current.style.background = 'unset';
          bottom.current.style.background = `rgba(${redValue}, ${greenValue}, ${blueValue} , ${alphaValue})`;
        }
      }
    };

    updateRulerDimensions();
  }, [
    mobileBreakpoint,
    isDragging,
    activePreset,
    rulerHeight,
    cursorLocation,
    backgroundColorRGBA,
    invert,
    stopped,
    lastEventTarget,
    pinned,
    overlayClickActive,
  ]);

  const handleSettingsOpen = (open: boolean) => {
    setSettingsOpen(open);
  };

  /**
   * handleSettingsChange
   * @param key key
   * @param value value
   */
  const handleSettingsChange = <T extends keyof ReadingRulerPresetSettings>(
    key: T,
    value: ReadingRulerPresetSettings[T]
  ) => {
    if (
      activePreset === 'default1' ||
      activePreset === 'default2' ||
      activePreset === 'default3'
    ) {
      // Changing from default presets to back to custom
      // spread last used custom settings and new changeable variable value
      setReadingRulerState(oldState => ({
        ...oldState,
        activePreset: 'custom',
        activePresetSettings: {
          ...oldState.activePresetSettings,
          ...customPresetSettings,
          [key]: value,
        },
      }));
    } else {
      console.log(key, value);
      // Here otherway
      setReadingRulerState(oldState => ({
        ...oldState,
        activePresetSettings: {
          ...oldState.activePresetSettings,
          [key]: value,
        },
      }));
    }
  };

  /**
   * handleChangePresetClick
   * @param presetName presetName
   * @param presetSettings presetSettings
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangePresetClick =
    (
      presetName: ReadingRulerNameType,
      presetSettings: Partial<ReadingRulerPresetSettings>
    ) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (
        activePreset === 'default1' ||
        activePreset === 'default2' ||
        activePreset === 'default3'
      ) {
        // Changing preset from any default preset to custom
        // presetsSettings hold old customPresetSettings values which will be changed to be active
        setReadingRulerState(oldState => ({
          ...oldState,
          activePreset: presetName,
          activePresetSettings: {
            ...oldState.activePresetSettings,
            ...presetSettings,
          },
        }));
      } else {
        // Here otherway
        // Changing to other default presets saves old active "custom" preset settings
        // for later use
        setReadingRulerState(oldState => ({
          ...oldState,
          activePreset: presetName,
          activePresetSettings: {
            ...oldState.activePresetSettings,
            ...presetSettings,
          },
          customPresetSettings: {
            ...oldState.activePresetSettings,
          },
        }));
      }
    };

  /**
   * handleRulerPinClick
   */
  const handleRulerPinClick = () => {
    setPinned(!pinned);
  };

  /**
   * handleRulerPinClick
   * @param state state
   */
  const handlePaletteToggle = (state: boolean) => {
    setStopped(state);
    setPaletteOpen(state);
  };

  /**
   * handleTouch
   * @param e event
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!pinned) {
      if (dragger && dragger.current) {
        setLastEventTarget(e.target);

        const handlePosition =
          dragger.current.getBoundingClientRect().top +
          dragger.current.getBoundingClientRect().height / 2;

        unstable_batchedUpdates(() => {
          setIsDragging(true);
          setCursorLocation(handlePosition);
        });
      }
    }
  };

  const modifiers: string[] = [];

  if (invert) {
    modifiers.push('inverted');
  }
  let rulerHeightIncrement = rulerHeight;

  return (
    <ReadingRulerContainer active={active}>
      <div
        className={`reading-ruler-top ${
          modifiers
            ? modifiers.map(m => `reading-ruler-top--${m}`).join(' ')
            : ''
        }`}
        ref={top}
      />

      <div
        className={`reading-ruler-middle ${
          modifiers
            ? modifiers.map(m => `reading-ruler-middle--${m}`).join(' ')
            : ''
        }`}
        ref={middle}
      />

      <div
        className={`reading-ruler-bottom ${
          modifiers
            ? modifiers.map(m => `reading-ruler-bottom--${m}`).join(' ')
            : ''
        }`}
        ref={bottom}
      />
      {tabletBreakpoint && (
        <div className="reading-ruler-dragger-handle-container" ref={dragger}>
          <div
            onTouchStart={handleTouchStart}
            className="reading-ruler-middle-mobile-handle"
          />
        </div>
      )}
      <ReadingRulerControllers
        ref={controllers}
        onClose={onClose}
        isOpen={settingsOpen}
        setOpen={handleSettingsOpen}
        tools={
          <>
            <Button
              ariaLabel={t('aria.decrease_ruler')}
              id="decreaseRulerSize"
              variant="outlined"
              color="secondary"
              icon="minus"
              tooltip={tabletBreakpoint ? '' : t('aria.decrease_ruler')}
              onClick={e =>
                handleSettingsChange(
                  'rulerHeight',
                  (rulerHeightIncrement -= 0.25)
                )
              }
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.25}
              value={rulerHeight}
              onChange={e =>
                handleSettingsChange(
                  'rulerHeight',
                  parseInt(e.currentTarget.value)
                )
              }
            />
            <Button
              ariaLabel={t('aria.increase_ruler')}
              id="increaseRulerSize"
              variant="outlined"
              color="secondary"
              tooltip={tabletBreakpoint ? '' : t('aria.increase_ruler')}
              icon="plus"
              onClick={e =>
                handleSettingsChange(
                  'rulerHeight',
                  (rulerHeightIncrement += 0.25)
                )
              }
            />
            {/* Removed from mobile view since it doesn't scale well and some features do not work correctly on mobile  */}
            {!mobileBreakpoint && (
              <>
                <Button
                  ariaLabel={t('aria.invert_colors')}
                  id="invertRulerColors"
                  variant="outlined"
                  color="secondary"
                  disabled={overlayClickActive}
                  active={invert}
                  tooltip={t('aria.invert_colors')}
                  icon="invert-colors"
                  onClick={e => handleSettingsChange('invert', !invert)}
                />
                {/* Removed from tablet view since it doesn't work correctly  */}
                {!tabletBreakpoint && (
                  <Button
                    ariaLabel={t('aria.click_through')}
                    id="clickThroughRuler"
                    variant="outlined"
                    color="secondary"
                    active={overlayClickActive}
                    tooltip={t('aria.click_through')}
                    icon={!overlayClickActive ? 'no-touch' : 'touch'}
                    onClick={e =>
                      handleSettingsChange(
                        'overlayClickActive',
                        !overlayClickActive
                      )
                    }
                  />
                )}
                <Dropdown
                  disableOutsideClick={true}
                  controlledIsOpen={paletteOpen}
                  controlledSetOpen={handlePaletteToggle}
                  closeOnMenuClick={false}
                  triggerEl={(isOpen, onClick) => (
                    <Button
                      ariaLabel={t('aria.choose_color')}
                      aria-expanded={isOpen}
                      id="rulerPalette"
                      variant="outlined"
                      color="secondary"
                      onClick={onClick}
                      tooltip={t('aria.choose_color')}
                      icon="palette"
                    />
                  )}
                >
                  {/* The id here shouldn't be changed, it's used in the click handling */}
                  <div id="colorPicker" className="color-picker">
                    <ChromePicker
                      color={backgroundColorRGBA}
                      onChange={e =>
                        handleSettingsChange('backgroundColorRGBA', e.rgb)
                      }
                    />
                  </div>
                </Dropdown>
                <Button
                  ariaLabel={t('aria.pin_ruler')}
                  id="pinRuler"
                  variant="outlined"
                  active={pinned}
                  color="secondary"
                  tooltip={t('aria.pin_ruler')}
                  icon="pin"
                  onClick={handleRulerPinClick}
                />
              </>
            )}
            {/* These are commented out as we test whether we gonna use these or not.
            <Button
              onClick={handleChangePresetClick("custom", customPresetSettings)}
              buttonModifiers={
                activePreset === "custom"
                  ? "reading-ruler-preset-active"
                  : undefined
              }
            >
              Oma
            </Button>
            <Dropdown
              openByHover
              content={
                <div>
                  {t("wcag.preset1")}
                </div>
              }
            >
              <Button
                onClick={handleChangePresetClick(
                  "default1",
                  readingRulerPresetDefault1
                )}
                buttonModifiers={
                  activePreset === "default1"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
                1
              </Button>
            </Dropdown>

            <Dropdown
              openByHover
              content={
                <div>
                  {t("wcag.preset2")}
                </div>
              }handlePaletteToggle
            >
              <Button
                onClick={handleChangePresetClick(
                  "default2",
                  readingRulerPresetDefault2
                )}
                buttonModifiers={
                  activePreset === "default2"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
              </Button>
            </Dropdown>

            <Dropdown
              openByHover
              content={
                <div>
                  {t("wcag.preset3")}
                </div>
              }
            >
              <Button
                onClick={handleChangePresetClick(
                  "default3",
                  readingRulerPresetDefault3
                )}
                buttonModifiers={
                  activePreset === "default3"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
                3
              </Button>
            </Dropdown> */}
          </>
        }
      />
    </ReadingRulerContainer>
  );
});
