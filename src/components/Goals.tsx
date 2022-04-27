import React from 'react';
import { Card, Divider, Grid } from 'semantic-ui-react';
import styled from 'styled-components';

const mockdata = {
  id: 'id',
  title: 'Tavoitteet',
  info_text: 'Aseta itsellesi enintään neljä tavoitetta.',
  image: {
    id: 20,
    url: 'https://storage.googleapis.com/client-opinvoimala-dev/goal_throphy_556de02402/goal_throphy_556de02402.png',
    alternativeText: '',
    caption: '',
  },
  goals: [
    {
      id: 19,
      description: 'Syö enemmän, mutta vähemmän kuin 160 merkkiä',
      done: false,
      created_at: '2022-04-26T11:49:57.000Z',
      updated_at: '2022-04-26T11:49:57.000Z',
    },
    {
      id: 18,
      description:
        'Katsele telkkarista enemmän jooga-ohjelmia, mutta ei täydellä mahalla tai saunan jälkeen edes vitsinä, koska me kaikki tiedetään miten siinä lopulta sitten käy',
      done: false,
      created_at: '2022-04-26T11:49:45.000Z',
      updated_at: '2022-04-26T11:49:45.000Z',
    },
    {
      id: 17,
      description: 'Nuku pidempiä yöunia',
      done: false,
      created_at: '2022-04-26T11:49:38.000Z',
      updated_at: '2022-04-26T11:49:38.000Z',
    },
    {
      id: 16,
      description: 'MUOKATTU',
      done: true,
      created_at: '2022-04-26T11:35:55.000Z',
      updated_at: '2022-04-26T11:42:36.000Z',
    },
  ],
};

const Goal = styled.li<{ done?: boolean }>`
  background-color: ${p => (p.done ? 'green' : 'none')};
  ${p => p.theme.shadows[0]};
  ${p => p.theme.font.h4};
  line-height: 28px;
  padding-right: 48px;
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
`;

const StyledGrid = styled(Grid)`
  @media ${p => p.theme.breakpoint.mobile} {
    &.ui.grid > .column:not(.row) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

export const Goals: React.FC = () => {
  return (
    <>
      <StyledGrid columns={2}>
        <h2 id={mockdata.id}>{mockdata.title}</h2>

        <img src={mockdata.image.url} alt="new" />
      </StyledGrid>
      {mockdata.info_text}
      <Divider section hidden aria-hidden="true" />
      <StyledGrid columns={1}>
        {mockdata.goals.map(({ id, description, done }) => (
          <Grid.Column key={id}>
            <Goal key={id} done={done}>
              {description}
            </Goal>
          </Grid.Column>
        ))}
      </StyledGrid>
    </>
  );
};
