import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/AppointmentsStore';
import { COLORS } from '../../theme';
import Annotation from '../Annotation';
import { Input } from '../inputs';
import AppointmentDetails from './AppointmentDetails';

const Container = styled.div`
  ${p => p.theme.font.size.xs};
  h2 {
    ${p => p.theme.font.h5};
    margin-bottom: 0;
  }
  .make_appointment__cancel_info {
    font-style: italic;
  }
`;

interface Props {
  appointment?: Appointment;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

export const MakeAppointmentPhase3Confirm: React.FC<Props> = observer(
  ({ appointment, name, setName, email, setEmail }) => {
    const { t } = useTranslation();

    const handleChange =
      (setter: Dispatch<SetStateAction<string>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.currentTarget.value);
      };

    if (!appointment) {
      return t('error.appointment.make.appointment_not_selected');
    }

    return (
      <Container>
        <AppointmentDetails appointment={appointment} direction="row" />

        <h2>{t('view.appointments.make_new.contact_data_title')}</h2>
        <p>{t('view.appointments.make_new.contact_data_info')}</p>

        <Annotation
          simple
          text={t('annotation.asterisk_is_required')}
          prefix={<span style={{ color: COLORS.accent }}>* </span>}
        />

        <Input
          autoFocus
          required
          label={t('label.name')}
          id="make_appointment__name-input"
          name="name"
          value={name}
          onChange={handleChange(setName)}
          size="large"
        />
        <Input
          required
          label={t('label.email')}
          id="make_appointment__email-input"
          name="email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          size="large"
        />

        <p className="make_appointment__cancel_info">
          {t('view.appointments.make_new.cancel_info')}
        </p>
      </Container>
    );
  }
);

export default MakeAppointmentPhase3Confirm;
