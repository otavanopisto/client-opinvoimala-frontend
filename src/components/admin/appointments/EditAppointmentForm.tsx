import { DateTime } from 'luxon';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import i18n from '../../../i18n';
import { useAdminStore } from '../../../store/admin/adminStoreContext';
import {
  AppointmentIn,
  AppointmentStatus,
  RepeatRule,
  RepeatScope,
} from '../../../store/models';
import { today } from '../../../utils/date';
import { Button, Input, Select } from '../../inputs';
import DatePicker from '../../inputs/DatePicker';
import TimePicker from '../../inputs/TimePicker';
import Message from '../../Message';
import EditAppointmentButton from './EditAppointmentButton';

const statusOptions = Object.values(AppointmentStatus).map(status => ({
  id: status,
  label: i18n.t(`view.appointments.status.${status}`),
}));

const getStatusOption = (status: AppointmentStatus) => {
  return statusOptions.find(({ id }) => id === status) ?? statusOptions[0];
};

const REPEAT_OPTIONS = Object.values(RepeatRule).map(rule => ({
  id: rule,
  label: i18n.t(`view.admin.appointments.repeat.${rule}`),
}));

const Form = styled.form`
  margin-top: ${p => p.theme.spacing.lg};

  .appointment-form {
    &__content-container,
    &__buttons-container {
      display: flex;
    }
    &__buttons-container {
      justify-content: space-between;
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
    appointments: {
      appointmentState,
      createAppointment,
      editAppointment,
      deleteAppointment,
      getOverlappingAppointments,
    },
    specialists: {
      specialists,
      specialistOptions,
      getSpecialist,
      getSpecialistOption,
    },
  } = useAdminStore();

  // Default values
  const defaultDate = today().plus({ days: 1 }).toJSDate();
  const defaultStatus = getStatusOption(AppointmentStatus.available);
  const defaultSpecialist = specialistOptions[0];

  // Form data
  const [date, setDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [meetLink, setMeetLink] = useState('');
  const [statusOption, setStatusOption] =
    useState<SelectOption<string>>(defaultStatus);
  const [specialistOption, setSpecialistOption] =
    useState<SelectOption<number>>(defaultSpecialist);
  const [repeatOption, setRepeatOption] = useState<SelectOption<string>>(
    REPEAT_OPTIONS[0]
  );
  const [repeatUntil, setRepeatUntil] = useState(defaultDate);

  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [overlapMsgs, setOverlapMsgs] = useState<string[]>([]);

  // Refs
  const appointmentRef = useRef<number>();
  const specialistsRef = useRef<number>();

  // Other stuff
  const isBusy = appointmentState === 'PROCESSING';
  const closeForm = () => setAppointment(undefined);
  const repeatRule = repeatOption.id;
  const repeatOnce = repeatRule === 'once';

  /**
   * Initializes form data when editing appointment
   */
  useEffect(() => {
    const appointmentChanged = appointmentRef.current !== appointment?.id;
    const specialistsChanged = specialistsRef.current !== specialists.length;
    if (appointment && (appointmentChanged || specialistsChanged)) {
      appointmentRef.current = appointment.id;
      specialistsRef.current = specialists.length;

      const {
        status,
        appointmentSpecialist,
        meetingLink,
        repeatRule,
        repeatUntil,
      } = appointment;
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

      const repeatOption = REPEAT_OPTIONS.find(({ id }) => id === repeatRule);
      if (repeatOption) {
        setRepeatOption(repeatOption);
      }
      if (repeatUntil) setRepeatUntil(new Date(repeatUntil));
    }
  }, [appointment, getSpecialist, getSpecialistOption, specialists]);

  useEffect(() => {
    // Update repeatUntil if date was set later than the current until date
    setRepeatUntil(repeatUntil => (date > repeatUntil ? date : repeatUntil));
  }, [date]);

  /**
   * Detect overlapping appointments to show warning to user
   */
  useEffect(() => {
    setOverlapMsgs([]);
    if (date || endDate || repeatOption || repeatUntil) {
      const overlappingAppointments = getOverlappingAppointments(
        date.toISOString(),
        endDate.toISOString(),
        repeatOption.id as RepeatRule,
        repeatUntil.toISOString(),
        appointment?.repeatGroup
      );
      setOverlapMsgs(overlappingAppointments);
    }
  }, [
    appointment?.repeatGroup,
    date,
    endDate,
    getOverlappingAppointments,
    repeatOption,
    repeatUntil,
  ]);

  const handleSubmit = async (repeatScope = RepeatScope.none) => {
    const startTime = date.toISOString();
    const endTime = endDate.toISOString();
    const specialist =
      specialistOption.id > 0 ? specialistOption.id : defaultSpecialist?.id;

    const _appointment: AppointmentIn = {
      id: appointment?.id ?? -1,
      status: statusOption.id as AppointmentStatus,
      startTime,
      endTime,
      meetingLink: meetLink,
      appointmentSpecialist: specialist,
      repeatRule: repeatOption.id as RepeatRule,
      repeatUntil: repeatOnce ? startTime : repeatUntil.toISOString(),
      repeatGroup: appointment?.repeatGroup,
    };

    if (_appointment.id > 0) {
      const { success } = await editAppointment({
        appointment: _appointment,
        repeatScope,
      });
      if (success) closeForm();
      else setErrorMsgs([t('error.unknown_error')]);
    } else {
      const { success } = await createAppointment(_appointment);
      if (success) closeForm();
      else setErrorMsgs([t('error.unknown_error')]);
    }
  };

  const handleDelete = async (repeatScope = RepeatScope.none) => {
    if (appointment?.id) {
      const { success } = await deleteAppointment({
        id: appointment.id,
        repeatScope,
      });
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

  const handleRepeatRuleChange = (
    option?: SelectOption<string> | null | undefined
  ) => {
    !!option && setRepeatOption(option);
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
            minDate={today().plus({ days: 1 }).toJSDate()}
            inline
          />
        </div>

        <div className="appointment-form__inputs-container">
          <FlexRow>
            <Select<string>
              id="appointment-form__status-select"
              label={t('view.admin.appointments.form.status')}
              options={statusOptions}
              selectedOption={statusOption}
              onSelect={handleStatusChange}
              showDefaultOption={false}
              autoFocus
            />
            <TimePicker
              selected={date}
              onChange={handleDateChange(setDate)}
              label={t('view.admin.appointments.form.start_time')}
              minTime={DateTime.fromJSDate(date).startOf('day').toJSDate()}
              maxTime={DateTime.fromJSDate(endDate)
                .minus({ minutes: 1 })
                .toJSDate()}
            />
            <TimePicker
              selected={endDate}
              onChange={handleDateChange(setEndDate)}
              label={t('view.admin.appointments.form.end_time')}
              minTime={DateTime.fromJSDate(date)
                .plus({ minutes: 1 })
                .toJSDate()}
              maxTime={DateTime.fromJSDate(endDate).endOf('day').toJSDate()}
            />
          </FlexRow>

          <FlexRow>
            <Select<number>
              id="appointment-form__specialist-role-select"
              label={t('view.admin.appointments.form.specialist')}
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

          <Divider hidden />

          <FlexRow>
            <Select<string>
              id="appointment-form__repeat-rule-select"
              label={t('view.admin.appointments.repeat.label')}
              options={REPEAT_OPTIONS}
              selectedOption={repeatOption}
              onSelect={handleRepeatRuleChange}
              showDefaultOption={false}
              disabled={!isAddingNew}
            />
            <DatePicker
              selected={repeatOnce ? date : repeatUntil}
              onChange={handleDateChange(setRepeatUntil)}
              label={t('view.admin.appointments.repeat.until_label')}
              disabled={!isAddingNew || repeatOnce}
              minDate={date}
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
        {!!overlapMsgs.length && (
          <div>
            <Message
              warning
              icon="warning sign"
              header={t('view.admin.appointments.form.overlap.heading')}
              content={t('view.admin.appointments.form.overlap.text')}
              list={overlapMsgs}
            />
          </div>
        )}
      </Transition.Group>

      <Divider hidden />

      <div className="appointment-form__buttons-container">
        <FlexRow>
          {!isAddingNew && appointment && (
            <EditAppointmentButton
              actionType="delete"
              appointment={appointment}
              onConfirm={handleDelete}
            />
          )}
        </FlexRow>
        <FlexRow>
          <Button
            id="appointment-form__cancel-button"
            text={t('action.cancel')}
            onClick={closeForm}
            disabled={isBusy}
            color="grey3"
            negativeText
          />
          {isAddingNew && (
            <Button
              id="appointment-form__submit-button"
              text={submitText}
              onClick={() => handleSubmit()}
              disabled={isBusy}
            />
          )}
          {!isAddingNew && repeatOnce && (
            <Button
              id="appointment-form__submit-button"
              text={submitText}
              onClick={() => handleSubmit()}
              disabled={isBusy}
            />
          )}
          {!isAddingNew && !repeatOnce && appointment && (
            <EditAppointmentButton
              appointment={appointment}
              actionType="edit"
              onConfirm={handleSubmit}
            />
          )}
        </FlexRow>
      </div>
    </Form>
  );
};

export default EditAppointmentForm;
