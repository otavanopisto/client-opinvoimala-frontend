import { observer } from 'mobx-react-lite';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Loader, Segment, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import Storage from '../services/storage';
import { Icon as SemanticIcon } from 'semantic-ui-react';
import { Button } from './inputs';
import { Feedback as FeedbackType } from '../store/models';
import { Colors } from '../theme/styled';
import Message from './Message';

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
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
  margin-bottom: ${p => p.theme.spacing.lg};

  @media ${p => p.theme.breakpoint.mobile} {
    ${p => p.theme.font.h4};
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${p => p.theme.spacing.lg};

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
      contentPages: {
        sendFeedback: sendPageFeedback,
        feedbackState: contentFeedbackState,
      },
      tests: {
        sendFeedback: sendTestFeedback,
        feedbackState: testFeedbackState,
      },
    } = useStore();

    const [likeButtonActive, setLikeButtonActive] = useState(false);
    const [dislikeButtonActive, setDislikeButtonActive] = useState(false);

    const locallyStoredFeedback = Storage.read({ key: 'FEEDBACK_LIKES' });

    const contentTypeRef = useRef<string>();
    const slugRef = useRef<string>();

    /**
     * Set initial button states on mount (or when content changes)
     */
    useEffect(() => {
      const contentTypeChanged = contentTypeRef.current !== contentType;
      const slugChanged = slugRef.current !== slug;

      if (contentTypeChanged || slugChanged) {
        contentTypeRef.current = contentType;
        slugRef.current = slug;

        if (locallyStoredFeedback?.[contentType]?.[slug] === undefined)
          setInitialButtonStates(null);
        else {
          setInitialButtonStates(locallyStoredFeedback[contentType][slug]);
        }
      }
    }, [locallyStoredFeedback, contentType, slug]);

    const setInitialButtonStates = (locallyStoredFeedback: AnswerType) => {
      setLikeButtonActive(locallyStoredFeedback === 'LIKE');
      setDislikeButtonActive(locallyStoredFeedback === 'DISLIKE');
    };

    const title = feedback?.title || t('view.user_feedback.title');

    const likes = feedback?.likes;

    const dislikes = feedback?.dislikes;

    const isBusy = [contentFeedbackState, testFeedbackState].includes(
      'PROCESSING'
    );

    const error = [contentFeedbackState, testFeedbackState].includes('ERROR');

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

    const submitFeedback = async (feedbackType: FeedbackChangeType) => {
      let feedbackSent = false;

      switch (contentType) {
        case 'page':
          const { success: pageSuccess } = await sendPageFeedback({
            id: id,
            contentType: contentType,
            feedbackType: feedbackType,
          });
          feedbackSent = pageSuccess;
          break;

        case 'test':
          const { success: testSuccess } = await sendTestFeedback({
            id: id,
            contentType: contentType,
            feedbackType: feedbackType,
          });
          feedbackSent = testSuccess;
          break;
      }
      if (feedbackSent) storeFeedbackLocally(feedbackType);

      return feedbackSent;
    };

    const updateFeedbackButtonStates = (type: 'like' | 'dislike') => {
      setLikeButtonActive(prev => (type === 'like' ? !prev : false));
      setDislikeButtonActive(prev => (type === 'dislike' ? !prev : false));
    };

    const handleFeedbackButtonClick = async (type: 'like' | 'dislike') => {
      let feedbackSentSuccessfully = false;

      if (!likeButtonActive && !dislikeButtonActive) {
        // Both buttons are untouched
        feedbackSentSuccessfully = await submitFeedback(type); // 'like' or 'dislike'
      } else if (!likeButtonActive && dislikeButtonActive) {
        // User has already pressed dislike
        const feedback = type === 'like' ? 'dislike-to-like' : 'undislike';
        feedbackSentSuccessfully = await submitFeedback(feedback);
      } else if (likeButtonActive && !dislikeButtonActive) {
        // User has already pressed like
        const feedback = type === 'like' ? 'unlike' : 'like-to-dislike';
        feedbackSentSuccessfully = await submitFeedback(feedback);
      }

      if (feedbackSentSuccessfully) updateFeedbackButtonStates(type);
    };

    const feedbackButtons = [
      {
        type: 'like',
        count: likes,
        text: t('action.yes'),
        color: getButtonColor(likeButtonActive) as keyof Colors,
        icon: <SemanticIcon name="thumbs up" size="large" />,
        onClick: () => handleFeedbackButtonClick('like'),
        negativeText: !likeButtonActive,
      },
      {
        type: 'disLike',
        count: dislikes,
        text: t('action.no'),
        color: getButtonColor(dislikeButtonActive) as keyof Colors,
        icon: <SemanticIcon name="thumbs down" size="large" />,
        onClick: () => handleFeedbackButtonClick('dislike'),
        negativeText: !dislikeButtonActive,
      },
    ];

    return (
      <FeedbackContainer>
        <Transition.Group>
          {error && (
            <div>
              <Message
                error
                icon="warning sign"
                header={t('view.user_feedback.error')}
              />
            </div>
          )}
        </Transition.Group>
        <Header>
          {title}
          <Loader disabled={!isBusy} active size="large" />
        </Header>
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
                  disabled={isBusy}
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
