import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import Icon from './Icon';
import { Button } from './inputs';
import Heading, { HeadingLevel } from './Heading';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;

  button {
    border-radius: ${p => p.theme.borderRadius.sm};
    margin-left: ${p => p.theme.spacing.md};
  }
`;

interface Props {
  columns?: number;
  elements: JSX.Element[];
  title: string;
  headingLevel?: HeadingLevel;
}

export const Carousel: React.FC<Props> = observer(
  ({ title, columns = 3, elements, headingLevel = 'h2' }) => {
    const [firstItem, setFirstItem] = useState(0);
    const [lastItem, setLastItem] = useState(columns);

    const visibleElements =
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

    const getArrowIcon = (type: 'ArrowRight' | 'ArrowLeft') => (
      <Icon type={type} strokeColor="secondary" color="none" width={22} />
    );

    return (
      <div>
        <Header>
          {title && (
            <Heading level={headingLevel} className="carousel-heading">
              {title}
            </Heading>
          )}
          <Buttons>
            <Button
              id="carousel__show-previous-button"
              color="grey3"
              icon={getArrowIcon('ArrowLeft')}
              onClick={handleShowPrevious}
            />
            <Button
              id="carousel__show-next-button"
              color="grey3"
              icon={getArrowIcon('ArrowRight')}
              onClick={handleShowNext}
            />
          </Buttons>
        </Header>

        <Grid padded="vertically" columns={3} stretched>
          {visibleElements}
        </Grid>
      </div>
    );
  }
);
