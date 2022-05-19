import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
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
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
      setCurrentPage(0);
    }, [elements]);

    const pages = Math.ceil(elements.length / columns);

    const visibleElements = elements.slice(
      columns * currentPage,
      columns * currentPage + columns
    );

    const handleShowPrevious = () => {
      currentPage === 0
        ? setCurrentPage(pages - 1)
        : setCurrentPage(prev => prev - 1);
    };

    const handleShowNext = () => {
      currentPage === pages - 1
        ? setCurrentPage(0)
        : setCurrentPage(prev => prev + 1);
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
        {!!elements.length && (
          <div>
            {currentPage + 1} / {pages}
          </div>
        )}
      </div>
    );
  }
);
