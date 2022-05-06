import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { LinkList as LinkListType } from '../store/models';
import Icon from './Icon';
import Button from './inputs/Button';
import Link from './Link';

const Container = styled.section`
  margin: ${p => p.theme.spacing.xl} 0;

  h1 {
    ${p => p.theme.font.h2};
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      a {
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: 1px solid ${p => p.theme.color.secondary};
        border-radius: ${p => p.theme.borderRadius.md};
        background-color: ${p => p.theme.color.grey3};
        margin: ${p => p.theme.spacing.md} 0;
        padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};

        font-family: ${p => p.theme.font.secondary};
        ${p => p.theme.font.size.md};
        color: ${p => p.theme.color.secondary};
        text-decoration: none;
        :hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

interface Props {
  list: LinkListType;
  initialItemCount?: number;
}

const LinkList: React.FC<Props> = ({ list, initialItemCount }) => {
  const { title, links } = list;

  const { t } = useTranslation();

  const [itemCount, setItemCount] = useState(
    initialItemCount || list.links.length
  );

  if (!links.length) return null;

  const visibleItems = list.links.slice(0, itemCount);

  const isAllItemsVisible = visibleItems.length >= list.links.length;

  const buttonText = isAllItemsVisible
    ? t('action.minimize')
    : t('action.show_all');

  const iconType = isAllItemsVisible ? 'ChevronUp' : 'ChevronDown';

  const handleShowAll = () => {
    setItemCount(
      isAllItemsVisible && initialItemCount
        ? initialItemCount
        : list.links.length
    );
  };

  return (
    <Container>
      {title && <h1>{title}</h1>}

      <ul>
        {visibleItems.map(link => (
          <li key={link.id}>
            <Link link={link} label={link.label} showArrow />
          </li>
        ))}
      </ul>

      {initialItemCount !== undefined && list.links.length && (
        <Grid centered>
          <Button
            id={`link-list-${title}-show-all-button`}
            text={buttonText}
            variant="link"
            icon={<Icon type={iconType} color="none" width={24} />}
            onClick={handleShowAll}
          />
        </Grid>
      )}
    </Container>
  );
};

export default LinkList;
