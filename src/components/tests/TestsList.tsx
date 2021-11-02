import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { SimpleTest } from '../../store/TestsStore';
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

interface Props {
  title: string;
  items: SimpleTest[];
  initialItemCount?: number;
}

const TestsList: React.FC<Props> = ({ title, items, initialItemCount = 3 }) => {
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
      <h2>{title}</h2>
      <StyledGrid columns={3} stackable doubling stretched>
        {visibleItems.map(test => (
          <Grid.Column key={test.id}>
            <Card
              title={test.name}
              text={test.description}
              link={getLink(test)}
            />
          </Grid.Column>
        ))}
      </StyledGrid>

      {!isAllItemsVisible && (
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

      {isAllItemsVisible && items.length > initialItemCount && (
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
      <Divider hidden section />
    </>
  );
};

export default TestsList;
