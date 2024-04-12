import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/models';
import { formatDateTime } from '../../utils/date';
import Icon from '../Icon';
import { Button } from '../inputs';
import NoPrint from '../NoPrint';

const ListItem = styled.li<{ isHidden?: boolean }>`
  opacity: ${p => p.isHidden && 0.6};
  font-family: ${p => p.theme.font.secondary};
  font-size: 1rem;
  flex-direction: column;
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.spacing.lg};
  padding: ${p => p.theme.spacing.lg};
  ${p => p.theme.shadows[0]};
  background-color: ${p => p.isHidden && p.theme.color.grey3};

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    page-break-before: avoid;
  }

  .appointment {
    &__time,
    &__specialist--role {
      color: ${p => p.theme.color.foreground};
    }
    &__time {
      min-width: 140px;
      &.is-cancelled {
        text-decoration: line-through;
      }
    }
    &__status {
      min-width: 120px;
      display: flex;
      align-items: center;
      font-weight: bold;
      .status-indicator {
        width: 16px;
        height: 16px;
        border-radius: 50px;
        margin-right: 6px;

        &.is-cancelled,
        &.is-hidden {
          background-color: ${p => p.theme.color.grey4};
        }
        &.is-available {
          background-color: ${p => p.theme.color.primaryLight};
        }
        &.is-booked {
          background-color: #eb5a96;
        }
      }
    }
    about:blank &__time,
    &__specialist {
      line-height: 140%;
    }

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

  @media ${p => p.theme.breakpoint.tablet} {
    align-items: center;
    flex-direction: row;

    .appointment {
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
        flex-direction: row;
        > button {
          :not(:last-child) {
            margin-right: ${p => p.theme.spacing.lg};
          }
        }
      }
    }
  }
`;

interface Props extends Appointment {
  onEdit?: (id: number) => void;
  onCancel?: (id: number) => void;
  onJoin?: (link: string) => void;
  showStatus?: boolean;
}

export const AppointmentsListItem: React.FC<Props> = ({
  id,
  status,
  startTime,
  endTime,
  appointmentSpecialist,
  meetingLink,
  onEdit,
  onCancel,
  onJoin,
  showStatus,
}) => {
  const { t } = useTranslation();

  const isCancelled = status === 'cancelled';
  const isHidden = status === 'hidden';

  const showEditButton = !!onEdit;
  const showCancelButton = !!onCancel && !isCancelled && !isHidden;
  const showJoinButton = !!onJoin && !!meetingLink && !isCancelled && !isHidden;

  const getJoinButtonText = () => {
    const key = isCancelled
      ? 'cancelled'
      : showStatus || !!onEdit
      ? 'join_meeting_short'
      : 'join_meeting';
    return t(`view.appointments.action.${key}`);
  };

  const handleJoinButtonClick = () => {
    if (!isCancelled && onJoin) onJoin(meetingLink);
  };

  const formatTime = (startTime: string, endTime: string) => {
    const options = { format: 'T' };
    const start = formatDateTime(startTime, options);
    const end = formatDateTime(endTime, options);
    const prefix = t('label.time_abbrv');
    return `${prefix} ${start}\u2013${end}`;
  };

  const renderStatus = () => {
    let text = t(`view.appointments.status.${status}`);
    let className = `status-indicator is-${status}`;

    return (
      <>
        <div className={className}></div>
        {text}
      </>
    );
  };

  const cancelledClass = isCancelled ? ' is-cancelled' : '';

  return (
    <ListItem key={id} isHidden={isHidden}>
      <div className={`appointment__time ${cancelledClass}`}>
        <div>{formatDateTime(startTime, { format: 'ccc D' })}</div>
        <div>{formatTime(startTime, endTime)}</div>
      </div>

      {showStatus && (
        <div className={`appointment__status ${cancelledClass}`}>
          {renderStatus()}
        </div>
      )}

      <div className="appointment__specialist">
        <div className="appointment__specialist--role">
          {appointmentSpecialist?.role ?? ''}
        </div>
        <div>{appointmentSpecialist?.name}</div>
      </div>

      <NoPrint>
        <div className="appointment__action-buttons">
          {showCancelButton && (
            <Button
              id={`appointment-${id}__cancel-button`}
              text={t('view.appointments.action.cancel_appointment')}
              onClick={() => onCancel(id)}
              color="grey3"
              negativeText
              noMargin
            />
          )}
          {showJoinButton && (
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
          {showEditButton && (
            <Button
              id={`appointment-${id}__edit-button`}
              text={t('action.edit')}
              onClick={() => onEdit(id)}
              variant="filled"
              color="grey3"
              negativeText
              noMargin
            />
          )}
        </div>
      </NoPrint>

      {!showStatus && isCancelled && (
        <i>{t('view.appointments.action.cancelled')}</i>
      )}
    </ListItem>
  );
};

export default AppointmentsListItem;
