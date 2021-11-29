import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import { LinkIn } from '../store/models';
import Link from './Link';

const Container = styled.div`
  width: 100%;
  .accordion__trigger-button {
    button {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
    }
  }
  a,
  span,
  button {
    width: 100%;
  }

  .accordion__menu {
    max-height: 0;
    opacity: 0;
    &.is-open {
      max-height: 1000px;
      opacity: 1;
    }

    &.is-hidden {
      display: none;
    }

    transition: all 0.2s ease-in-out;

    li.accordion__item {
      a,
      span,
      button {
        padding-left: ${p => p.theme.spacing.xl};
        ${p => p.theme.font.size.lg};
      }
    }
  }
`;

interface Props {
  id: number | string;
  label: string;
  items?: LinkIn[];
}

const AccordionMenu: React.FC<Props> = ({ id, label, items }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    if (items?.length) {
      setIsOpen(!isOpen);
    }
  };

  if (!items?.length) {
    return null;
  }

  return (
    <Container>
      <div className="accordion__trigger-button">
        <button
          aria-expanded={isOpen}
          aria-haspopup={true}
          onClick={toggleAccordion}
        >
          {label}
          <Icon type="Plus" color="primary" />
        </button>
      </div>

      <ul
        aria-labelledby={t('aria.menu')}
        aria-hidden={!isOpen}
        className={`accordion__menu${isOpen ? ' is-open' : ' is-hidden'}`}
      >
        {items.map(link => (
          <li key={`accordion-item-${link.id}`} className="accordion__item">
            <Link link={link}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default AccordionMenu;
