import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import Storage from '../services/storage';
import Icon from './Icon';
import { Button } from './inputs';
import { Feedback as FeedbackType } from '../store/models';
import { Colors } from '../theme/styled';

export type FeedbackChangeType =
  | 'like'
  | 'dislike'
  | 'unlike'
  | 'undislike'
  | 'dislike-to-like'
  | 'like-to-dislike';

export type AnswerType = 'LIKE' | 'DISLIKE' | null;

const FeedbackContainer = styled.div`
  margin: ${p => p.theme.spacing.lg};
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
  id: number;
  feedback: FeedbackType | null | undefined;
  slug: string;
  contentType: 'page' | 'test';
}

export const Feedback: React.FC<Props> = observer(
  ({ id, feedback, slug, contentType }) => {
    const { t } = useTranslation();

    const {
      contentPages: { sendFeedback: sendPageFeedback },
      tests: { sendFeedback: sendTestFeedback },
    } = useStore();

    const [likeButtonActive, setLikeButtonActive] = useState(false);
    const [dislikeButtonActive, setDislikeButtonActive] = useState(false);

    const locallyStoredFeedback = Storage.read({ key: 'FEEDBACK_LIKES' });

    useEffect(() => {
      if (locallyStoredFeedback?.[contentType]?.[slug] === undefined)
        setInitialButtonStates(null);
      else {
        setInitialButtonStates(locallyStoredFeedback[contentType][slug]);
      }
    }, [locallyStoredFeedback, contentType, slug]);

    const setInitialButtonStates = (locallyStoredFeedback: AnswerType) => {
      setLikeButtonActive(locallyStoredFeedback === 'LIKE');
      setDislikeButtonActive(locallyStoredFeedback === 'DISLIKE');
    };

    const title = feedback?.title || t('view.user_feedback.title');

    const likes = feedback?.likes;

    const dislikes = feedback?.dislikes;

    const getButtonColor = (buttonState: boolean) => {
      return buttonState ? 'primary' : 'grey3';
    };

    const storeFeedbackLocally = (feedbackType: FeedbackChangeType) => {
      const getFeedbackValue = (feedbackType: FeedbackChangeType) => {
        if (['like', 'dislike-to-like'].includes(feedbackType)) return 'LIKE';
        if (['dislike', 'like-to-dislike'].includes(feedbackType))
          return 'DISLIKE';
        return null;
      };

      let feedback = locallyStoredFeedback;
      switch (contentType) {
        case 'page':
          feedback = {
            ...feedback,
            page: { ...feedback?.page, [slug]: getFeedbackValue(feedbackType) },
          };
          break;
        case 'test':
          feedback = {
            ...feedback,
            test: { ...feedback?.test, [slug]: getFeedbackValue(feedbackType) },
          };
          break;
      }
      Storage.write({
        key: 'FEEDBACK_LIKES',
        value: feedback,
      });
    };

    const submitFeedback = (feedbackType: FeedbackChangeType) => {
      switch (contentType) {
        case 'page':
          sendPageFeedback({
            id: id,
            contentType: contentType,
            feedbackType: feedbackType,
          });

          break;
        case 'test':
          sendTestFeedback({
            id: id,
            contentType: contentType,
            feedbackType: feedbackType,
          });
          break;
      }
      storeFeedbackLocally(feedbackType);
    };

    const updateFeedbackButtonStates = (type: 'like' | 'dislike') => {
      setLikeButtonActive(prev => (type === 'like' ? !prev : false));
      setDislikeButtonActive(prev => (type === 'dislike' ? !prev : false));
    };

    const handleFeedbackButtonClick = (type: 'like' | 'dislike') => {
      if (!likeButtonActive && !dislikeButtonActive) {
        // Both buttons are untouched
        submitFeedback(type); // 'like' or 'dislike'
      } else if (!likeButtonActive && dislikeButtonActive) {
        // User has already pressed dislike
        const feedback = type === 'like' ? 'dislike-to-like' : 'undislike';
        submitFeedback(feedback);
      } else if (likeButtonActive && !dislikeButtonActive) {
        // User has already pressed like
        const feedback = type === 'like' ? 'unlike' : 'like-to-dislike';
        submitFeedback(feedback);
      }

      updateFeedbackButtonStates(type);
    };

    const feedbackButtons = [
      {
        type: 'like',
        count: likes,
        text: t('action.yes'),
        color: getButtonColor(likeButtonActive) as keyof Colors,
        icon: <Icon type="Thumbs" />,
        onClick: () => handleFeedbackButtonClick('like'),
        negativeText: !likeButtonActive,
      },
      {
        type: 'disLike',
        count: dislikes,
        text: t('action.no'),
        color: getButtonColor(dislikeButtonActive) as keyof Colors,
        icon: <Icon className="dislike-icon" type={'Thumbs'} />,
        onClick: () => handleFeedbackButtonClick('dislike'),
        negativeText: !dislikeButtonActive,
      },
    ];

    return (
      <FeedbackContainer>
        <Header>{title}</Header>
        <Buttons>
          {feedbackButtons.map(
            ({ type, count, text, color, icon, onClick, negativeText }) => (
              <Segment key={type} className="button-segment" basic>
                {!!count && (
                  <Label
                    color="grey"
                    size="small"
                    className="button-badge"
                    floating
                  >
                    {count}
                  </Label>
                )}

                <Button
                  id={`user-feedback__${type}-button`}
                  text={text}
                  type="button"
                  color={color}
                  icon={icon}
                  onClick={onClick}
                  negativeText={negativeText}
                  iconPosition="left"
                />
              </Segment>
            )
          )}
        </Buttons>
      </FeedbackContainer>
    );
  }
);

export default Feedback;
