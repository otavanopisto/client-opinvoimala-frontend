import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/storeContext';
import DropdownMenu from '../DropdownMenu';
import { Link } from '../../store/models';
import { useWindowDimensions } from '../../utils/hooks';
import Drawer from '../Drawer';
import Button from '../inputs/Button';
import Icon from '../Icon';
import AccordionMenu from '../AccordionMenu';

interface Props {
  admin?: boolean;
}

const NavBar: React.FC<Props> = observer(({ admin }) => {
  const { t } = useTranslation();
  const { isTablet, isMobile } = useWindowDimensions();

  const {
    navigation: { state, navigation, fetchNavigation },
    ruler: { open, setRulerOpen },
  } = useStore();

  useEffect(() => {
    if (state === 'NOT_FETCHED') fetchNavigation();
  }, [fetchNavigation, state]);

  const navItems = navigation?.items ?? [];

  const getVisibleLinks = (links: Link[]) => {
    return links.filter(({ type, page, test, internal, external }) => {
      const isPage = type === 'page' && !!page;
      const isTest = type === 'test' && !!test;
      const isInternal = type === 'internal' && !!internal?.length;
      const isExternal = type === 'external' && !!external?.length;
      return isPage || isTest || isInternal || isExternal;
    });
  };

  if (admin) return null;

  if (isTablet || isMobile) {
    return (
      <Drawer
        triggerEl={(isOpen, onClick) => (
          <Button
            ariaLabel={t('aria.main_navigation')}
            aria-expanded={isOpen}
            id="navigation-menu__button"
            variant="outlined"
            color="secondary"
            icon={<Icon type="Menu" strokeColor="secondary" />}
            onClick={onClick}
          />
        )}
      >
        <ul className="drawer__link-list">
          {navItems.map(({ id, label, links }) => (
            <li key={id}>
              <AccordionMenu
                id={id}
                label={label}
                items={getVisibleLinks(links)}
              />
            </li>
          ))}
        </ul>
      </Drawer>
    );
  }

  return (
    <nav>
      {navItems.map(navItem => (
        <DropdownMenu
          key={navItem.id}
          triggerButton={{
            label: navItem.label,
          }}
          items={getVisibleLinks(navItem.links)}
        />
      ))}
    </nav>
  );
});

export default NavBar;
