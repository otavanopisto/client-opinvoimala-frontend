import React from 'react';
import { SemanticWIDTHS, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { Card as CardType } from '../store/models';
import Card from './Card';
import { HeadingLevel } from './Heading';

const Container = styled.div`
  margin-top: ${p => p.theme.spacing.xl};
  margin-bottom: ${p => p.theme.spacing.xl};
`;

interface Props {
  cards: CardType[];
  columns?: SemanticWIDTHS;
  headingLevel?: HeadingLevel;
}

const Cards: React.FC<Props> = ({ cards, columns = 4, headingLevel }) => {
  return (
    <Container>
      <Grid columns={columns} stackable doubling centered stretched>
        {cards?.map(card => (
          <Grid.Column key={card.id}>
            <Card key={card.id} headingLevel={headingLevel} {...card} />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default Cards;
