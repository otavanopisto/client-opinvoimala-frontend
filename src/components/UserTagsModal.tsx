import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Modal, { Props as ModalProps } from './Modal';
import UserTagsForm from './UserTagsForm';

interface Props extends ModalProps {}

export const UserTagsModal: React.FC<Props> = observer(
  ({ tagsFormOpen, setTagsFormOpen, ...props }) => {
    const { t } = useTranslation();

    const closeForm = () => {
      setTagsFormOpen(false);
    };

    return (
      <Modal
        {...props}
        open={tagsFormOpen}
        onClose={closeForm}
        title={t('view.user_tags.form.title')}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <UserTagsForm closeForm={closeForm} />
      </Modal>
    );
  }
);

export default UserTagsModal;
