import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Icon from './Icon';
// const Container = styled.li`
//   display: flex;
//   align-items: center;

//   background-color: ${p => p.theme.color.accentLight};
//   border-radius: ${p => p.theme.borderRadius.sm};

//   padding: ${p => p.theme.spacing.sm};
//   color: ${p => p.theme.color.secondary};
//   font-family: ${p => p.theme.font.secondary};
//   ${p => p.theme.font.size.xs};

//   button {
//     font-family: inherit;
//     color: inherit;
//     cursor: pointer;
//     padding: 0;
//     border: 1px solid transparent;
//     border-radius: inherit;

//     :hover {
//       border: 1px solid ${p => p.theme.color.secondary};
//     }
//   }

const Container = styled.li`
  display: flex;
  
  align-items: center;
  justify-content: space-between;

  background-color: ${p => p.theme.color.accentLight};
  border-radius: ${p => p.theme.borderRadius.sm};



  :not(:last-child) {
    margin-right: ${p => p.theme.spacing.sm};
  }
  ${p => p.theme.font.size.xs};

  .tag-text {
    padding: 0 ${p => p.theme.spacing.sm};
    color: ${p => p.theme.color.secondary};
    font-family: ${p => p.theme.font.secondary};
  
    border: 1px solid transparent;
  }

  .remove-button {
    padding: 0 ${p => p.theme.spacing.md};
    line-height: 100%;
  }

  .tag-text-button {
    :hover { 
      border-radius: inherit;
      border: 1px solid ${p => p.theme.color.secondary};
  }
`;

interface Props {
  name: string;
  handleClick?: () => void;
  handleRemove?: () => void;
}

const Tag: React.FC<Props> = observer(({ name, handleClick, handleRemove }) => {
  return (
    <Container>
      {handleClick ? (
        <button className="tag-text tag-text-button" onClick={handleClick}>
          {name}
        </button>
      ) : (
        <>
          <div className="tag-text">{name}</div>
          {handleRemove && (
            <button className="remove-button" onClick={handleRemove}>
              <Icon type="Close" color="secondary" width={13} />
            </button>
          )}
        </>
      )}
    </Container>
  );
});

export default Tag;
