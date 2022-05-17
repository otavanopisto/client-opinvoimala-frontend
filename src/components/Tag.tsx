import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.li`
  display: flex;
  align-items: center;

  background-color: ${p => p.theme.color.accentLight};
  border-radius: ${p => p.theme.borderRadius.sm};
  margin-right: ${p => p.theme.spacing.sm};
  padding: 0 ${p => p.theme.spacing.sm};
  color: ${p => p.theme.color.secondary};
  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.xs};

  button {
    font-family: inherit;
    cursor: pointer;
    border: 1px solid transparent;

    :hover {
      border: 1px solid ${p => p.theme.color.secondary};
    }
  }
`;

interface Props {
  id: number;
  name: string;
  handleClick?: () => void;
  handleRemove?: () => void;
}

const Tag: React.FC<Props> = observer(
  ({ id, name, handleClick, handleRemove }) => {
    return (
      <Container>
        {handleClick ? (
          <button onClick={handleClick}>{name}</button>
        ) : (
          <>
            <div>{name}</div>
            {handleRemove && (
              <button onClick={handleRemove}>
                <Icon type="Close" color="secondary" width={22} />
              </button>
            )}
          </>
        )}
      </Container>
    );
  }
);

export default Tag;
