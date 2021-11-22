import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { SimpleTest } from '../../store/models';
import { makeLink } from '../../utils/links';
import Card from '../Card';
import Icon from '../Icon';
import { Button } from '../inputs';

const StyledGrid = styled(Grid)`
  @media ${p => p.theme.breakpoint.mobile} {
    &.ui.grid > .column:not(.row) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

const ChildrenContainer = styled.div`
  a {
    display: flex;
    align-items: center;
    color: ${p => p.theme.color.secondary};
    ${p => p.theme.font.size.md};
    svg {
      margin-left: ${p => p.theme.spacing.md};
    }

    :hover {
      color: ${p => p.theme.color.secondary};
    }
  }
`;

interface Props {
  id: string;
  title: string;
  items: SimpleTest[];
  initialItemCount?: number;
  disableExpand?: boolean;
  customExpandAction?: {
    label: string;
    icon?: JSX.Element;
    onClick: Function;
  };
}

const TestsList: React.FC<Props> = ({
  id,
  title,
  items,
  initialItemCount = 3,
  disableExpand = false,
  customExpandAction,
  children,
}) => {
  const { t } = useTranslation();

  const [itemCount, setItemCount] = useState(initialItemCount);

  if (!items.length) return null;

  const visibleItems = items.slice(0, itemCount);

  const isAllItemsVisible = visibleItems.length >= items.length;

  // Unused "show more" handler in case needed later:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShowMoreItems = () => {
    const step = initialItemCount;
    const newCount = itemCount + step;
    if (newCount < items.length) {
      setItemCount(newCount);
    } else {
      handleShowAllItems();
    }
  };

  const handleShowAllItems = () => {
    setItemCount(items.length);
  };

  const handleMinimizeItems = () => {
    setItemCount(initialItemCount);
  };

  const getLink = (test: SimpleTest) =>
    makeLink({
      id: test.id,
      label: t('view.tests.action.start_test'),
      type: 'test',
      target: {
        ...test,
        title: test.name,
      },
    });

  return (
    <>
      <h2 id={id}>{title}</h2>
      <StyledGrid columns={3} stackable doubling stretched>
        {visibleItems.map(test => (
          <Grid.Column key={test.id}>
            <Card
              title={test.name}
              text={test.description}
              tags={test.categories?.map(({ label }) => label)}
              link={getLink(test)}
              badge={
                test.completedByUser && <Icon type="Completed" width={28} />
              }
            />
          </Grid.Column>
        ))}
      </StyledGrid>

      {!disableExpand && !isAllItemsVisible && (
        <Grid centered>
          <Button
            id={`test-list-${title}-show-more-button`}
            text={t('view.tests.action.show_all_from_category')}
            variant="link"
            icon={<Icon type="ChevronDown" color="none" width={24} />}
            onClick={handleShowAllItems}
          />
        </Grid>
      )}

      {!disableExpand && isAllItemsVisible && items.length > initialItemCount && (
        <Grid centered>
          <Button
            id={`test-list-${title}-minimize-button`}
            text={t('action.minimize')}
            variant="link"
            icon={<Icon type="ChevronUp" color="none" width={24} />}
            onClick={handleMinimizeItems}
          />
        </Grid>
      )}

      {customExpandAction && (
        <Grid centered>
          <Button
            id={`test-list-${title}-custom-action-button`}
            text={customExpandAction.label}
            variant="link"
            icon={
              customExpandAction.icon ?? (
                <Icon
                  type="ArrowRight"
                  strokeColor="secondary"
                  color="none"
                  width={22}
                />
              )
            }
            onClick={() => customExpandAction.onClick()}
          />
        </Grid>
      )}

      <ChildrenContainer>{children}</ChildrenContainer>
      <Divider hidden section />
    </>
  );
};

export default TestsList;
