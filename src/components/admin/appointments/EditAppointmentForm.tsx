import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import i18n from '../../../i18n';
import { useAdminStore } from '../../../store/admin/adminStoreContext';
import { AppointmentIn, AppointmentStatus } from '../../../store/models';
import { Button, Input, Select } from '../../inputs';
import DatePicker from '../../inputs/DatePicker';
import TimePicker from '../../inputs/TimePicker';
import Message from '../../Message';

const statusOptions = Object.values(AppointmentStatus).map(status => ({
  id: status,
  label: i18n.t(`view.appointments.status.${status}`),
}));

const getStatusOption = (status: AppointmentStatus) => {
  return statusOptions.find(({ id }) => id === status) ?? statusOptions[0];
};

const Form = styled.form`
  margin-top: ${p => p.theme.spacing.lg};

  .appointment-form {
    &__content-container,
    &__buttons-container {
      display: flex;
    }
    &__buttons-container {
      justify-content: flex-end;
      align-items: center;
      button {
        :not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }
    &__date-picker-container {
      padding-right: ${p => p.theme.spacing.lg};
      border-right: 1px solid ${p => p.theme.color.grey3};
    }
    &__inputs-container {
      padding-left: ${p => p.theme.spacing.lg};
      flex: 1;
      > * {
        :not(:first-child) {
          margin-top: ${p => p.theme.spacing.lg};
        }
      }
    }
  }
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * {
    flex: 1;
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.lg};
    }
  }
`;

interface Props {
  appointment?: AppointmentIn;
  setAppointment: Dispatch<SetStateAction<AppointmentIn | undefined>>;
  isAddingNew: boolean;
}

const EditAppointmentForm: React.FC<Props> = ({
  appointment,
  setAppointment,
  isAddingNew,
}) => {
  const { t } = useTranslation();

  const {
    appointments: { appointmentState, createAppointment, editAppointment },
    specialists: {
      specialists,
      specialistOptions,
      getSpecialist,
      getSpecialistOption,
    },
  } = useAdminStore();

  // Default values
  const defaultStatus = getStatusOption(AppointmentStatus.available);
  const defaultSpecialist = specialistOptions[0];

  // Form data
  const [date, setDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [meetLink, setMeetLink] = useState<string>('');
  const [statusOption, setStatusOption] =
    useState<SelectOption<string>>(defaultStatus);
  const [specialistOption, setSpecialistOption] =
    useState<SelectOption<number>>(defaultSpecialist);

  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  // Refs
  const appointmentRef = useRef<number>();
  const specialistsRef = useRef<number>();

  // Other stuff
  const isBusy = appointmentState === 'PROCESSING';
  const closeForm = () => setAppointment(undefined);

  /**
   * Initializes form data when editing appointment
   */
  useEffect(() => {
    const appointmentChanged = appointmentRef.current !== appointment?.id;
    const specialistsChanged = specialistsRef.current !== specialists.length;
    if (appointment && (appointmentChanged || specialistsChanged)) {
      appointmentRef.current = appointment.id;
      specialistsRef.current = specialists.length;

      const { status, appointmentSpecialist, meetingLink } = appointment;
      const specialistId = appointmentSpecialist?.id;
      const specialistOption = getSpecialistOption(specialistId);
      const specialist = getSpecialist(specialistId) ?? specialists[0];
      const meetLink = meetingLink?.length
        ? meetingLink
        : appointmentSpecialist?.meetingLink ?? specialist?.meetingLink ?? '';

      setStatusOption(getStatusOption(status));
      setDate(new Date(appointment.startTime));
      setEndDate(new Date(appointment.endTime));
      setSpecialistOption(specialistOption);
      setMeetLink(meetLink);
    }
  }, [appointment, getSpecialist, getSpecialistOption, specialists]);

  const handleSubmit = async () => {
    const _appointment: AppointmentIn = {
      id: appointment?.id ?? -1,
      status: statusOption.id as AppointmentStatus,
      startTime: date?.toISOString(),
      endTime: endDate?.toISOString(),
      meetingLink: meetLink,
      appointmentSpecialist:
        specialistOption.id > 0 ? specialistOption.id : defaultSpecialist?.id,
    };

    if (_appointment.id > 0) {
      const { success } = await editAppointment(_appointment);
      if (success) closeForm();
      else setErrorMsgs([t('error.unknown_error')]);
    } else {
      const { success } = await createAppointment(_appointment);
      if (success) closeForm();
      else setErrorMsgs([t('error.unknown_error')]);
    }
  };

  const handleDateChange =
    (setter: Dispatch<SetStateAction<Date>>, action?: 'updateEndDate') =>
    (newDate: Date | [Date | null, Date | null] | null) => {
      if (newDate && !Array.isArray(newDate)) {
        setter(newDate);
        if (action === 'updateEndDate') {
          // Keep start date & end date in sync (Times differs but both dates should still match)
          setEndDate(endDate => {
            endDate.setDate(newDate.getDate());
            endDate.setMonth(newDate.getMonth());
            endDate.setFullYear(newDate.getFullYear());
            return endDate;
          });
        }
      }
    };

  const handleInputChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.currentTarget.value);
    };

  const handleStatusChange = (
    option?: SelectOption<string> | null | undefined
  ) => {
    !!option && setStatusOption(option);
  };

  const handleSpecialistChange = (
    option?: SelectOption<number> | null | undefined
  ) => {
    if (option) {
      setSpecialistOption(option);
      setMeetLink(getSpecialist(option?.id)?.meetingLink ?? meetLink ?? '');
    }
  };

  const submitText = isAddingNew
    ? t('view.admin.appointments.form.submit')
    : t('action.save');

  return (
    <Form>
      <div className="appointment-form__content-container">
        <div className="appointment-form__date-picker-container">
          <DatePicker
            selected={date}
            onChange={handleDateChange(setDate, 'updateEndDate')}
            inline
          />
        </div>

        <div className="appointment-form__inputs-container">
          <FlexRow>
            <Select<string>
              id="appointment-form__status-select"
              label="Status"
              options={statusOptions}
              selectedOption={statusOption}
              onSelect={handleStatusChange}
              showDefaultOption={false}
            />
            <TimePicker
              selected={date}
              onChange={handleDateChange(setDate)}
              label={t('view.admin.appointments.form.start_time')}
            />
            <TimePicker
              selected={endDate}
              onChange={handleDateChange(setEndDate)}
              label={t('view.admin.appointments.form.end_time')}
            />
          </FlexRow>

          <FlexRow>
            <Select<number>
              id="appointment-form__specialist-role-select"
              label="Rooli"
              options={specialistOptions}
              selectedOption={specialistOption}
              onSelect={handleSpecialistChange}
              showDefaultOption={false}
            />
            <Input
              value={meetLink}
              label={t('view.admin.appointments.form.meet_link')}
              onChange={handleInputChange(setMeetLink)}
              size="small"
              icon="linkify"
              iconPosition="left"
              noMargin
            />
          </FlexRow>
        </div>
      </div>

      <Transition.Group>
        {!!errorMsgs.length && (
          <div>
            <Message
              error
              icon="warning sign"
              header={t('view.admin.appointments.form.error.heading')}
              list={errorMsgs}
            />
          </div>
        )}
      </Transition.Group>

      <div className="appointment-form__buttons-container">
        <Button
          id="appointment-form__cancel-button"
          text={t('action.cancel')}
          onClick={closeForm}
          disabled={isBusy}
          color="grey3"
          negativeText
        />
        <Button
          id="appointment-form__continue-button"
          text={submitText}
          onClick={handleSubmit}
          disabled={isBusy}
        />
      </div>
    </Form>
  );
};

export default EditAppointmentForm;
