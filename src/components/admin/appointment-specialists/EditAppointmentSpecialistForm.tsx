import { observer } from 'mobx-react-lite';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Loader, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import { useAdminStore } from '../../../store/admin/adminStoreContext';
import { SpecialistIn } from '../../../store/models';
import { useWindowDimensions } from '../../../utils/hooks';
import { Button, Input, Select } from '../../inputs';
import Message from '../../Message';

const Form = styled.form`
  margin-top: ${p => p.theme.spacing.lg};

  > * {
    margin-bottom: ${p => p.theme.spacing.md};
  }

  .appointment-specialist-form {
    &__role-and-name-container {
      flex-direction: column;
      > div {
        :first-child {
          width: 100%;
          margin-right: 0;
        }
      }
      > *:not(:last-child) {
        margin-bottom: ${p => p.theme.spacing.md};
      }
    }
    &__buttons-container {
      flex-direction: column-reverse;
      align-items: center;
      > div {
        width: 100%;
        &.left-column {
          flex-direction: column-reverse;
        }
      }
      button {
        width: 100%;
        :not(:last-child) {
          margin-right: 0;
        }
      }
    }
  }
}

  @media ${p => p.theme.breakpoint.tablet} {

    .appointment-specialist-form {
      &__role-and-name-container {
        display: flex;
        > div {
          width: 100%;
          :first-child {
            width: 320px;
            margin-right: ${p => p.theme.spacing.lg};
          }
        }
      }
      &__buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
  
        > div.left-column {
          display: flex;
          align-items: center;
        }
  
        button {
          :not(:last-child) {
            margin-right: ${p => p.theme.spacing.lg};
          }
        }
      }
    }



`;

interface Props {
  specialist?: SpecialistIn;
  setSpecialist: Dispatch<SetStateAction<SpecialistIn | undefined>>;
  isAddingNew: boolean;
}

const EditappointmentSpecialistsForm: React.FC<Props> = observer(
  ({ specialist, setSpecialist, isAddingNew }) => {
    const { t } = useTranslation();
    const { isMobile } = useWindowDimensions();

    // Store data & actions
    const {
      auth: { adminFullName, adminEmail },
      specialistRoles: { specialistRoleOptions, getSpecialistRoleOption },
      specialists: {
        processState,
        createAppointmentSpecialist,
        editAppointmentSpecialist,
        deleteAppointmentSpecialist,
      },
    } = useAdminStore();

    // Default values
    const defaultRole = specialistRoleOptions[0];

    // Form data
    const [name, setName] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [email, setEmail] = useState('');
    const [roleOption, setRoleOption] =
      useState<SelectOption<number>>(defaultRole);

    const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

    // Refs
    const specialistsRef = useRef<number>();
    const rolesRef = useRef<number>();

    // Other stuff
    const isBusy = processState === 'PROCESSING';
    const closeForm = () => setSpecialist(undefined);

    /**
     * Initializes form data when editing appointment
     */
    useEffect(() => {
      const specialistChanged = specialistsRef.current !== specialist?.id;
      const rolesChanged = rolesRef.current !== specialistRoleOptions.length;

      if (specialist && (specialistChanged || rolesChanged)) {
        specialistsRef.current = specialist.id ?? undefined;
        rolesRef.current = specialistRoleOptions.length;

        const { meetingLink, name, email, roleId } = specialist;
        if (specialistRoleOptions.length) {
          setRoleOption(getSpecialistRoleOption(roleId));
        }
        setName(name || adminFullName || '');
        setEmail(email || adminEmail || '');
        setMeetLink(meetingLink ?? '');
      }
    }, [
      adminEmail,
      adminFullName,
      specialist,
      getSpecialistRoleOption,
      specialistRoleOptions.length,
    ]);

    const handleSubmit = async () => {
      const _specialist: SpecialistIn = {
        id: specialist?.id ?? -1,
        meetingLink: meetLink,
        name,
        email,
        roleId: roleOption.id,
      };

      if (_specialist.id && _specialist.id > 0) {
        const { success } = await editAppointmentSpecialist(_specialist);
        if (success) closeForm();
        else setErrorMsgs([t('error.unknown_error')]);
      } else {
        const { success } = await createAppointmentSpecialist(_specialist);
        if (success) closeForm();
        else setErrorMsgs([t('error.unknown_error')]);
      }
    };

    const handleDelete = async () => {
      if (specialist?.id) {
        const confirmText = t(
          'view.admin.appointment_specialists.confirm.delete'
        );
        if (window.confirm(confirmText)) {
          const { success } = await deleteAppointmentSpecialist({
            id: specialist.id,
          });
          if (success) closeForm();
          else setErrorMsgs([t('error.unknown_error')]);
        }
      }
    };

    const handleInputChange =
      (setter: Dispatch<SetStateAction<string>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.currentTarget.value);
      };

    const handleRoleChange = (
      option?: SelectOption<number> | null | undefined
    ) => {
      !!option && setRoleOption(option);
    };

    const submitText = isAddingNew
      ? t('view.admin.appointment_specialists.form.submit')
      : t('action.save');

    return (
      <Form className="appointment-specialist-form" onSubmit={handleSubmit}>
        <Loader disabled={!isBusy} active size="massive" />

        <div className="appointment-specialist-form__role-and-name-container">
          <Select<number>
            id="appointment-specialist-form__status-select"
            label={t('view.admin.appointment_specialists.form.role')}
            options={specialistRoleOptions}
            selectedOption={roleOption}
            onSelect={handleRoleChange}
            showDefaultOption={false}
            autoFocus
          />

          <Input
            value={name}
            label={t('view.admin.appointment_specialists.form.name')}
            onChange={handleInputChange(setName)}
            icon="user"
            size="small"
            iconPosition="left"
            noMargin
          />
        </div>

        <Input
          value={email}
          label={t('view.admin.appointment_specialists.form.email')}
          onChange={handleInputChange(setEmail)}
          icon="at"
          size="small"
          iconPosition="left"
          noMargin
        />

        <Input
          value={meetLink}
          label={t('view.admin.appointment_specialists.form.meet_link')}
          onChange={handleInputChange(setMeetLink)}
          icon="linkify"
          size="small"
          iconPosition="left"
          noMargin
        />

        {!!errorMsgs.length && <Divider hidden aria-hidden="true" />}

        <Transition.Group>
          {!!errorMsgs.length && (
            <div>
              <Message
                error
                icon={isMobile ? undefined : 'warning sign'}
                header={t(
                  'view.admin.appointment_specialists.form.error.heading'
                )}
                list={errorMsgs}
              />
            </div>
          )}
        </Transition.Group>

        <Divider hidden aria-hidden="true" />

        <div className="appointment-specialist-form__buttons-container">
          <div className="left-column">
            <Button
              id="appointment-specialist-form__cancel-button"
              text={t('action.cancel')}
              onClick={closeForm}
              disabled={isBusy}
              color="grey3"
              negativeText
            />
            {!isAddingNew && (
              <Button
                id="appointment-specialist-form__delete-button"
                text={t('action.delete')}
                onClick={handleDelete}
                disabled={isBusy}
                color="accent"
              />
            )}
          </div>
          <Button
            id="appointment-specialist-form__submit-button"
            text={submitText}
            onClick={handleSubmit}
            disabled={isBusy}
            type="submit"
          />
        </div>
      </Form>
    );
  }
);

export default EditappointmentSpecialistsForm;
