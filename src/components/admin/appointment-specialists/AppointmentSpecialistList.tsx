import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Specialist } from '../../../store/models';
import { Button } from '../../inputs';

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  font-family: ${p => p.theme.font.secondary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.spacing.lg};
  padding: ${p => p.theme.spacing.lg};
  ${p => p.theme.shadows[0]};
  background-color: p.theme.color.grey3;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    page-break-before: avoid;
  }

  .specialist-item {
    &__details-container {
      line-height: 160%;
    }
    &__accent {
      font-weight: bold;
    }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    flex-direction: column;
    > button {
      margin-top: ${p => p.theme.spacing.lg};
      width: 100%;
    }
  }
`;

const MissingText = styled.span`
  color: ${p => p.theme.color.accent};
`;

interface Props {
  items: Specialist[];
  onEdit: (id: number) => void;
}

const AppointmentSpecialistList: React.FC<Props> = ({ items, onEdit }) => {
  const { t } = useTranslation();

  const getMissingText = (key: string) => {
    const text = t(`view.admin.appointment_specialists.${key}`);
    return <MissingText>{`[ ${text.toUpperCase()} ]`}</MissingText>;
  };

  const getRoleText = (role?: string | null) => {
    if (!role?.length) return getMissingText('role_missing');
    return role;
  };

  const getMeetLinkText = (link?: string | null) => {
    if (!link?.length) return getMissingText('meet_link_missing');
    return `${t('view.admin.appointment_specialists.form.meet_link')}: ${link}`;
  };

  const getRoleAndName = (role?: string | null, name?: string | null) => {
    return `${getRoleText(role)} ${name}`;
  };

  return (
    <List>
      {items.map(({ id, name, email, meetingLink, role }) => (
        <ListItem key={`${id}-${name}`}>
          <div className="specialist-item__details-container">
            <div className="specialist-item__accent">
              {getRoleAndName(role, name)}
            </div>
            <div>{email}</div>
            <div>{getMeetLinkText(meetingLink)}</div>
          </div>

          <Button
            id={`appointment-${id}__edit-button`}
            text={t('action.edit')}
            onClick={() => id && onEdit(id)}
            variant="filled"
            color="grey3"
            negativeText
            noMargin
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AppointmentSpecialistList;
