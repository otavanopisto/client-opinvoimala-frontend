import React from 'react';
import { SemanticWIDTHS, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { Card as CardType } from '../store/models';
import Card from './Card';

const Container = styled.div`
  margin-top: ${p => p.theme.spacing.xl};
  margin-bottom: ${p => p.theme.spacing.xl};
`;

interface Props {
  cards: CardType[];
  columns?: SemanticWIDTHS;
}

const Cards: React.FC<Props> = ({ cards, columns = 4 }) => {
  return (
    <Container>
      <Grid columns={columns} stackable doubling centered stretched>
        {cards?.map(card => (
          <Grid.Column key={card.id}>
            <Card key={card.id} {...card} />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default Cards;
