import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Storage from '../services/storage';
import Icon from './Icon';
import { Button } from './inputs';
import { Feedback as FeedbackType } from '../store/models';

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

interface Props {
  feedback: FeedbackType | null | undefined;
  slug: string;
  contentType: 'page' | 'test';
}

export const UserFeedback: React.FC<Props> = observer(
  ({ feedback, slug, contentType }) => {
    const { t } = useTranslation();

    const [likeButtonActive, setLikeButtonActive] = useState(false);
    const [dislikeButtonActive, setDislikeButtonActive] = useState(false);

    useEffect(() => {
      const locallyStoredFeedback = Storage.read({ key: 'FEEDBACK' })[
        contentType
      ][slug];
      setInitialButtonStates(locallyStoredFeedback);
    }, [contentType, slug]);

    const setInitialButtonStates = (
      locallyStoredFeedback: 'YES' | 'NO' | null
    ) => {
      switch (locallyStoredFeedback) {
        case 'YES':
          setLikeButtonActive(true);
          setDislikeButtonActive(false);
          break;
        case 'NO':
          setLikeButtonActive(false);
          setDislikeButtonActive(true);
          break;
        case null:
          setLikeButtonActive(false);
          setDislikeButtonActive(false);
      }
    };

    const title = feedback?.title
      ? feedback.title
      : t('view.user_feedback.title');

    const likes = feedback?.likes;

    const dislikes = feedback?.dislikes;

    const getButtonColor = (buttonState: boolean) => {
      return buttonState ? 'grey3' : 'primary';
    };

    const likeButtonColor = getButtonColor(likeButtonActive);

    const dislikeButtonColor = getButtonColor(dislikeButtonActive);

    const handleLike = () => {
      // if user has already pressed like
      if (likeButtonActive) {
        storeFeedbackLocally(null);
        console.log('vähennetään yksi like');
      }

      // if user hasn't pressed like, but has pressed dislike
      if (!likeButtonActive && dislikeButtonActive) {
        storeFeedbackLocally('YES');
        console.log('lisätään yksi like, vähennetään yksi dislike');
      }

      // if user hasn't pressed like nor dislike
      if (!likeButtonActive && !dislikeButtonActive) {
        storeFeedbackLocally('YES');
        console.log('Lisätään yksi like');
        // Storage.write({ key: 'FEEDBACK', value: {'page':answer});
      }

      setLikeButtonActive(prev => !prev);
      if (dislikeButtonActive) setDislikeButtonActive(false);
    };

    const handleDislike = () => {
      // if user has already pressed dislike
      storeFeedbackLocally(null);
      if (dislikeButtonActive) console.log('vähennetään yksi dislike');

      // if user hasn't pressed dislike, but has pressed like
      if (!dislikeButtonActive && likeButtonActive) storeFeedbackLocally('NO');
      console.log('lisätään yksi dislike, vähennetään yksi like');

      // if user hasn't pressed dislike nor like
      if (!dislikeButtonActive && !likeButtonActive) {
        storeFeedbackLocally('NO');
        console.log('Lisätään yksi dislike');
      }

      setDislikeButtonActive(prev => !prev);
      if (likeButtonActive) setLikeButtonActive(false);
    };

    const storeFeedbackLocally = (answer: 'YES' | 'NO' | null) => {
      Storage.write({
        key: 'FEEDBACK',
        value: { [contentType]: { [slug]: answer } },
      });
    };

    return (
      <>
        <Header>{title}</Header>
        <Buttons>
          <Segment className="button-segment" basic>
            {likes && (
              <Label
                color="grey"
                size="small"
                className="button-badge"
                floating
              >
                {likes}
              </Label>
            )}
            <Button
              id="user-feedback__like-button"
              color={likeButtonColor}
              text={t('action.yes')}
              icon={<Icon type={'Thumbs'} />}
              onClick={() => handleLike()}
            />
          </Segment>

          <Segment className="button-segment" basic>
            {dislikes && (
              <Label
                color="grey"
                size="small"
                className="button-badge"
                floating
              >
                {dislikes}
              </Label>
            )}

            <Button
              id="user-feedback__dislike-button"
              text={t('action.no')}
              type="button"
              color={dislikeButtonColor}
              icon={<Icon className="dislike-icon" type={'Thumbs'} />}
              onClick={() => handleDislike()}
            />
          </Segment>
        </Buttons>
      </>
    );
  }
);

export default UserFeedback;
