import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import Storage from '../services/storage';
import Icon from './Icon';
import { Button } from './inputs';
import { Feedback as FeedbackModel } from '../store/models';

export type feedbackType =
  | 'like'
  | 'dislike'
  | 'unlike'
  | 'undislike'
  | 'dislike-to-like'
  | 'like-to-dislike';

export type answerType = 'LIKE' | 'DISLIKE' | null;

const FeedbackContainer = styled.div`
  margin: ${p => p.theme.spacing.lg} ${p => p.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
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
    z-index: 0 !important;
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
  pageId: number;
  feedback: FeedbackModel | null | undefined;
  slug: string;
  contentType: 'page' | 'test';
}

export const Feedback: React.FC<Props> = observer(
  ({ pageId, feedback, slug, contentType }) => {
    const { t } = useTranslation();

    const { contentPages, tests } = useStore();

    const sendPageFeedback = contentPages.sendFeedback;
    const sendTestFeedback = tests.sendFeedback;

    const [likeButtonActive, setLikeButtonActive] = useState(false);
    const [dislikeButtonActive, setDislikeButtonActive] = useState(false);

    const locallyStoredFeedback = Storage.read({ key: 'FEEDBACK_LIKES' });

    const noLocallyStoredFeedback =
      !locallyStoredFeedback || !locallyStoredFeedback.hasOwnProperty(slug);

    useEffect(() => {
      if (noLocallyStoredFeedback) setInitialButtonStates(null);
      else {
        setInitialButtonStates(locallyStoredFeedback[slug]);
      }
    }, [locallyStoredFeedback, contentType, slug, noLocallyStoredFeedback]);

    const setInitialButtonStates = (locallyStoredFeedback: answerType) => {
      switch (locallyStoredFeedback) {
        case 'LIKE':
          setLikeButtonActive(true);
          setDislikeButtonActive(false);
          break;
        case 'DISLIKE':
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
      return buttonState ? 'primary' : 'grey3';
    };

    const likeButtonColor = getButtonColor(likeButtonActive);

    const dislikeButtonColor = getButtonColor(dislikeButtonActive);

    const handleLike = () => {
      // if user has already pressed like
      if (likeButtonActive) {
        submitFeedback(null, 'unlike');
      }

      // if user has already pressed dislike
      if (!likeButtonActive && dislikeButtonActive) {
        submitFeedback('LIKE', 'dislike-to-like');
      }

      // if user hasn't pressed like nor dislike
      if (!likeButtonActive && !dislikeButtonActive) {
        submitFeedback('LIKE', 'like');
      }
      setLikeButtonActive(prev => !prev);
      if (dislikeButtonActive) setDislikeButtonActive(false);
    };

    const handleDislike = () => {
      // if user has already pressed dislike
      if (dislikeButtonActive) {
        submitFeedback(null, 'undislike');
      }

      // if user has already pressed like
      if (!dislikeButtonActive && likeButtonActive) {
        submitFeedback('DISLIKE', 'like-to-dislike');
      }

      // if user hasn't pressed dislike nor like
      if (!dislikeButtonActive && !likeButtonActive) {
        submitFeedback('DISLIKE', 'dislike');
      }

      setDislikeButtonActive(prev => !prev);
      if (likeButtonActive) setLikeButtonActive(false);
    };

    const submitFeedback = (answer: answerType, feedbackType: feedbackType) => {
      switch (contentType) {
        case 'page':
          sendPageFeedback({
            id: pageId,
            contentType: contentType,
            feedbackType: feedbackType,
          });
          storeFeedbackLocally(answer);
          return;
        case 'test':
          sendTestFeedback({
            id: pageId,
            contentType: contentType,
            feedbackType: feedbackType,
          });
          storeFeedbackLocally(answer);
          return;
      }
    };

    const storeFeedbackLocally = (answer: answerType) => {
      const feedback = { ...locallyStoredFeedback, [slug]: answer };
      Storage.write({
        key: 'FEEDBACK_LIKES',
        value: feedback,
      });
    };

    return (
      <FeedbackContainer>
        <Header>{title}</Header>
        <Buttons>
          <Segment className="button-segment" basic>
            {!!likes && (
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
              negativeText={!likeButtonActive}
            />
          </Segment>

          <Segment className="button-segment" basic>
            {!!dislikes && (
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
              negativeText={!dislikeButtonActive}
            />
          </Segment>
        </Buttons>
      </FeedbackContainer>
    );
  }
);

export default Feedback;
