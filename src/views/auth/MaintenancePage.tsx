import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../../store/storeContext';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.color.primaryLight};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    color: ${p => p.theme.color.primary};
  }
`;

interface Props {
  text?: string | null;
}

const MaintenancePage: React.FC<Props> = observer(({ text }) => {
  const {
    settings: { settings },
  } = useStore();

  const { logo } = settings ?? {};

  return (
    <Container>
      {logo?.url && <img src={logo.url} height={'200px'} alt="logo" />}
      {text && <h1>{text}</h1>}
    </Container>
  );
});

export default MaintenancePage;
