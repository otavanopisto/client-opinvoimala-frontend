import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import Tooltip from './Tooltip';

const Container = styled.li`
  :not(:last-child) {
    margin-right: ${p => p.theme.spacing.sm};
  }

  .tag-inner-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.1rem ${p => p.theme.spacing.sm};

    background-color: ${p => p.theme.color.accentLight};
    border-radius: ${p => p.theme.borderRadius.sm};
    border: 1px solid transparent;

    font-family: ${p => p.theme.font.secondary};
    color: ${p => p.theme.color.secondary};
    ${p => p.theme.font.size.xs};

    user-select: none;
  }

  button {
    cursor: pointer;
  }

  .remove-button {
    display: flex;
    align-items: center;
    padding: 0;
    margin-left: ${p => p.theme.spacing.md};
  }

  button.tag-inner-container {
    :hover {
      border-radius: ${p => p.theme.borderRadius.sm};
      border: 1px solid ${p => p.theme.color.secondary};
    }
  }
`;

interface Props {
  name: string;
  handleClick?: () => void;
  handleRemove?: () => void;
}

const Tag: React.FC<Props> = observer(({ name, handleClick, handleRemove }) => {
  const { t } = useTranslation();

  return (
    <Container>
      {handleClick ? (
        <button className="tag-inner-container" onClick={handleClick}>
          {name}
        </button>
      ) : (
        <div className="tag-inner-container">
          <span>{name}</span>
          {handleRemove && (
            <Tooltip
              content={t('action.delete')}
              trigger={
                <button className="remove-button" onClick={handleRemove}>
                  <Icon type="Close" strokeColor="secondary" width={13} />
                </button>
              }
            />
          )}
        </div>
      )}
    </Container>
  );
});

export default Tag;
