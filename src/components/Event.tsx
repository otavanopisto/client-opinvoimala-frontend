import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatDateTime, localizedDate } from '../utils/date';
import { Event as EventType } from '../store/models';
import { Button } from './inputs';
import Icon from './Icon';
import Link from './Link';
import Image from './Image';

const EventContainer = styled.li<{ isSimple: boolean }>`
  display: flex;

  flex-direction: column-reverse;

  justify-content: space-between;
  ${p => p.theme.shadows[0]};
  background-color: ${p =>
    p.isSimple ? p.theme.color.grey3 : p.theme.color.background};
  border-radius: ${p => p.theme.borderRadius.sm};
  margin-top: ${p => p.theme.spacing.xl};
  margin-bottom: ${p => p.theme.spacing.md};
  margin-left: 0;
  width: 100%;
  font-family: ${p => p.theme.font.secondary};
  line-height: 28px;
  padding: ${p => p.theme.spacing.lg};

  .main-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h3 {
    color: ${p => (p.isSimple ? p.theme.color.grey : undefined)};
    margin-top: ${p => p.theme.spacing.md};
    margin-bottom: ${p => p.theme.spacing.md};
    ${p => p.theme.font.h4}
  }

  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.sm};

  img {
    width: 360px;
    border-radius: 0;
    margin-bottom: ${p => p.theme.spacing.lg};
  }

  button {
    margin-top: ${p => p.theme.spacing.lg};
  }

  a {
    color: ${p => (p.isSimple ? p.theme.color.grey : undefined)};
  }

  @media ${p => p.theme.breakpoint.tablet} {
    flex-direction: initial;

    img {
      width: 360px;
      border-radius: 0;
      margin-bottom: 0;
    }
  }
`;

const EventText = styled.div`
  flex: 1;
  margin-right: ${p => p.theme.spacing.lg};

  .event-description {
    margin-bottom: ${p => p.theme.spacing.md};
  }
`;

const EventLinks = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  list-style-type: none;

  a {
    display: inline-block;
  }
`;

interface Props {
  event: EventType;
  isSimple?: boolean;
}

const Event: React.FC<Props> = ({ event, isSimple = false }) => {
  const { date, description, duration, image, link, links, title } = event;

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
      <div className="main-column">
        <EventText>
          <div>{`${startTime}\u2013${endTime}`}</div>
          <h3>{title}</h3>
          <div className="event-description">{description}</div>
          <EventLinks>
            {links.map(link => (
              <li key={link.id}>
                <Link link={link} label={link.label} />
              </li>
            ))}
          </EventLinks>
        </EventText>
        {!isSimple && !!link && (
          <div>
            <Button
              id="event-join-webinar"
              text={t('view.events.action.join_webinar')}
              color="secondary"
              icon={<Icon type="Video" width={24} />}
              onClick={() => handleJoinMeeting(link)}
            />
          </div>
        )}
      </div>
      <div>
        {!isSimple && (
          <Image apiSrc={image?.url} alt={image?.alternativeText} />
        )}
      </div>
    </EventContainer>
  );
};

export default Event;
