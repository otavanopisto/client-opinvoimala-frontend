import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-right: ${p => p.theme.spacing.sm};

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 ${p => p.theme.spacing.sm};
    background-color: ${p => p.theme.color.accentLight};
    border-radius: ${p => p.theme.borderRadius.sm};

    color: ${p => p.theme.color.secondary};
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.xs};

    button {
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
  handleClick?: (id: number) => void;
  handleRemove?: (id: number) => void;
}

const Tag: React.FC<Props> = observer(
  ({ id, name, handleClick, handleRemove }) => {
    return (
      <Container>
        {handleClick && (
          <li>
            <button onClick={() => handleClick(id)}>{name} </button>
          </li>
        )}
        {!handleClick && (
          <li>
            <div>{name}</div>
            {handleRemove && (
              <button onClick={() => handleRemove(id)}>
                <Icon type="Close" />
              </button>
            )}
          </li>
        )}
      </Container>
    );
  }
);

export default Tag;
