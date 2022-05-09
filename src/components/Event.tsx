import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatDateTime, localizedDate } from '../utils/date';
import { Event as EventType } from '../store/models';
import { Button } from './inputs';
import Icon from './Icon';
import Link from './Link';

const EventContainer = styled.li<{ isSimple: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${p => p.theme.shadows[0]};
  background-color: ${p =>
    p.isSimple ? p.theme.color.grey3 : p.theme.color.background};
  border-radius: ${p => p.theme.borderRadius.sm};
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
  margin-left: 0;
  width: 100%;
  font-family: ${p => p.theme.font.secondary};
  line-height: 28px;
  padding: ${p => p.theme.spacing.xl};

  div {
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.sm};
  }

  img {
    width: 360px;
    border-radius: 0;
    justify-content: flex-end;
  }

  button {
    margin-top: ${p => p.theme.spacing.lg};
  }
`;
const EventText = styled.div`
  flex: 1;
  margin-right: ${p => p.theme.spacing.lg};
`;

interface Props {
  event: EventType;
  isSimple?: boolean;
}

const Event: React.FC<Props> = ({ event, isSimple = false }) => {
  const { date, description, duration, image, link, links, title } = event;
  console.log(event);
  const { t } = useTranslation();
  const startTime = formatDateTime(date);
  const endTime = localizedDate(date)
    .plus({ minutes: duration ?? 0 })
    .toFormat('T');

  const handleJoinMeeting = (link: string) => {
    window.open(link, '_newtab');
  };

  return (
    <EventContainer isSimple={isSimple}>
      <EventText>
        <div>{`${startTime}\u2013${endTime}`}</div>
        <h4>{title}</h4>
        <div>{description}</div>
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä tekstiä
        tekstiä tekstiä tekstiä tekstiä
        {!isSimple &&
          links.map(link => <Link link={link} label={link.label} />)}
        {!isSimple && !!link && (
          <Button
            id="event-join-webinar"
            text={t('view.events.action.join_webinar')}
            color="secondary"
            icon={<Icon type="Video" width={24} />}
            onClick={() => handleJoinMeeting(link)}
          />
        )}
      </EventText>
      {!isSimple && <img src={image?.url} alt={image?.alternativeText ?? ''} />}
    </EventContainer>
  );
};

export default Event;
