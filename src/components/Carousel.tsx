import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { Button } from './inputs';

interface Props {
  columns?: number;
  elements: JSX.Element[];
}

export const Carousel: React.FC<Props> = observer(
  ({ columns = 3, elements }) => {
    const [firstItem, setFirstItem] = useState(0);
    const [lastItem, setLastItem] = useState(columns);

    const visibleItems =
      lastItem < firstItem
        ? elements.slice(firstItem).concat(elements.slice(0, lastItem))
        : elements.slice(firstItem, lastItem);

    const handleShowPrevious = () => {
      firstItem - columns < 0
        ? setFirstItem(elements.length + (firstItem - columns))
        : setFirstItem(prev => prev - columns);

      lastItem - columns < 0
        ? setLastItem(elements.length + (lastItem - columns))
        : setLastItem(prev => prev - columns);
    };

    const handleShowNext = () => {
      firstItem + columns > elements.length
        ? setFirstItem(firstItem + columns - elements.length)
        : setFirstItem(prev => prev + columns);

      lastItem + columns > elements.length
        ? setLastItem(lastItem + columns - elements.length)
        : setLastItem(prev => prev + columns);
    };

    return (
      <div>
        <Button
          id="user-interests__show-previous-button"
          text={'<-'}
          color="primary"
          onClick={handleShowPrevious}
        />
        <Button
          id="user-interests__show-next-button"
          text={'->'}
          color="primary"
          onClick={handleShowNext}
        />
        <Grid padded="vertically" columns={3} stretched>
          {visibleItems.map(interest => interest)}
        </Grid>
      </div>
    );
  }
);
