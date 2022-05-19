import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Grid, SemanticWIDTHSNUMBER } from 'semantic-ui-react';
import styled from 'styled-components';
import Icon from './Icon';
import { Button } from './inputs';
import Heading, { HeadingLevel } from './Heading';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;

  .page-indicator {
    color: ${p => p.theme.color.grey2};
    ${p => p.theme.font.size.xs};
    margin-right: ${p => p.theme.spacing.md};
  }

  button {
    border-radius: ${p => p.theme.borderRadius.sm};
    margin-left: ${p => p.theme.spacing.md};
  }

  @media ${p => p.theme.breakpoint.mobile} {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .buttonPrev {
      order: 1;
    }

    .page-indicator {
      order: 2;
    }

    .buttonNext {
      order: 3;
    }
  }
`;

interface Props {
  columns?: SemanticWIDTHSNUMBER;
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

    const pageIndicator = `${currentPage + 1} / ${pages}`;

    return (
      <div>
        <Header>
          {title && (
            <Heading level={headingLevel} className="carousel-heading">
              {title}
            </Heading>
          )}

          <Buttons>
            {!!elements.length && (
              <div className="page-indicator">{pageIndicator}</div>
            )}
            <div className="buttonPrev">
              <Button
                id="carousel__show-previous-button"
                color="grey3"
                icon={getArrowIcon('ArrowLeft')}
                onClick={handleShowPrevious}
              />
            </div>
            <div className="buttonNext">
              <Button
                id="carousel__show-next-button"
                color="grey3"
                icon={getArrowIcon('ArrowRight')}
                onClick={handleShowNext}
              />
            </div>
          </Buttons>
        </Header>
        <Grid padded="vertically" columns={columns} stretched>
          {visibleElements}
        </Grid>
      </div>
    );
  }
);
