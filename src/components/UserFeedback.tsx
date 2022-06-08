import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Label, Menu, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Icon from './Icon';
import { Button } from './inputs';

const Header = styled.div`
  display: flex;
  justify-content: center;
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
  margin-bottom: ${p => p.theme.spacing.lg};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    display: flex;
    flex-direction: row-reverse;
    margin: 0;

    svg {
      margin-left: 0;
      margin-right: ${p => p.theme.spacing.sm};
    }
  }

  .dislike-icon {
    transform: rotate(180deg);
  }

  .button-segment {
    padding: 0;
    margin: 0;
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.lg};
    }
  }

  .button-badge {
    border-radius: ${p => p.theme.borderRadius.lg};
  }
`;

export const UserFeedback: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <>
      {/*title datasta ?*/}
      <Header>Oliko tämä sisältö sinulle hyödyllinen?</Header>
      <Buttons>
        <Segment className="button-segment" basic>
          <Label color="grey" size="small" className="button-badge" floating>
            22
          </Label>
          <Button
            id="user-feedback__like-button"
            color="primary"
            text={t('action.yes')}
            icon={<Icon type={'Thumbs'} />}
          />
        </Segment>
        <Segment className="button-segment" basic>
          <Label color="grey" size="small" className="button-badge" floating>
            22
          </Label>
          <Button
            id="user-feedback__dislike-button"
            text={t('action.no')}
            negativeText
            type="button"
            color="grey3"
            icon={<Icon className="dislike-icon" type={'Thumbs'} />}
          />
        </Segment>
      </Buttons>
    </>
  );
});

export default UserFeedback;
