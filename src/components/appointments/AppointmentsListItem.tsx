import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/AppointmentsStore';
import { formatDateTime } from '../../utils/date';
import Icon from '../Icon';
import { Button } from '../inputs';

const ListItem = styled.li`
  font-family: ${p => p.theme.font.secondary};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.spacing.lg};
  padding: ${p => p.theme.spacing.lg};
  ${p => p.theme.shadows[0]};

  .appointment {
    &__time,
    &__specialist--role {
      color: ${p => p.theme.color.foreground};
    }

    &__time {
      min-width: 200px;
      &.is-cancelled {
        text-decoration: line-through;
      }
    }

    &__specialist {
      flex: 1;
      margin-left: ${p => p.theme.spacing.lg};
      &--role {
        margin-right: ${p => p.theme.spacing.lg};
        font-weight: bold;
      }
    }

    &__action-buttons {
      display: flex;
      > button {
        :not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    flex-direction: column;
    align-items: flex-start;

    .appointment {
      &__specialist {
        margin: 0;
        margin-top: ${p => p.theme.spacing.lg};
        span {
          display: block;
        }
      }
      &__action-buttons {
        margin-top: ${p => p.theme.spacing.lg};
        flex-direction: column-reverse;

        > button {
          margin: 0;
          margin-top: ${p => p.theme.spacing.md};
        }
      }
    }
  }
`;

interface Props extends Appointment {
  onCancel?: (id: number) => void;
  onJoin?: (link: string) => void;
}

export const AppointmentsListItem: React.FC<Props> = ({
  id,
  status,
  startTime,
  appointmentSpecialist,
  meetingLink,
  onCancel,
  onJoin,
}) => {
  const { t } = useTranslation();

  const showButtons = !!onCancel || !!onJoin;

  const isCancelled = status === 'cancelled';

  const getJoinButtonText = () => {
    const key = isCancelled ? 'cancelled' : 'join_meeting';
    return t(`view.appointments.action.${key}`);
  };

  const handleJoinButtonClick = () => {
    if (!isCancelled && onJoin) onJoin(meetingLink);
  };

  return (
    <ListItem key={id}>
      <div
        className={`appointment__time ${isCancelled ? ' is-cancelled' : ''}`}
      >
        {formatDateTime(startTime)}
      </div>

      {appointmentSpecialist && (
        <div className="appointment__specialist">
          <span className="appointment__specialist--role">
            {appointmentSpecialist.role ?? ''}
          </span>
          <span>{appointmentSpecialist.name}</span>
        </div>
      )}

      {showButtons && (
        <div className="appointment__action-buttons">
          {!isCancelled && onCancel && (
            <Button
              id={`appointment-${id}__cancel-button`}
              text={t('view.appointments.action.cancel_appointment')}
              onClick={() => onCancel(id)}
              color="grey3"
              negativeText
              noMargin
            />
          )}
          {onJoin && !!meetingLink && (
            <Button
              id={`appointment-${id}__join-meet-button`}
              icon={<Icon type="Video" width={24} />}
              text={getJoinButtonText()}
              onClick={handleJoinButtonClick}
              disabled={isCancelled}
              color={isCancelled ? 'accent' : undefined}
              variant={isCancelled ? 'link' : undefined}
              noMargin
            />
          )}
        </div>
      )}

      {!showButtons && isCancelled && (
        <i>{t('view.appointments.action.cancelled')}</i>
      )}
    </ListItem>
  );
};

export default AppointmentsListItem;
