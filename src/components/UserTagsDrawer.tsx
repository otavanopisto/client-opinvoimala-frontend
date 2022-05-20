import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import UserTagsForm from './UserTagsForm';
import Drawer from './Drawer';
import styled from 'styled-components';

const Header = styled.header`
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
`;

interface Props {
  tagsFormOpen: boolean;
  setTagsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserTagsDrawer: React.FC<Props> = observer(
  ({ tagsFormOpen, setTagsFormOpen, ...props }) => {
    const { t } = useTranslation();

    const closeForm = () => {
      setTagsFormOpen(false);
    };

    return (
      <Drawer fullWidth open={tagsFormOpen} onClose={closeForm}>
        <Header>{t('view.user_tags.form.title')}</Header>
        <UserTagsForm closeForm={closeForm} tagsFormOpen={tagsFormOpen} />
      </Drawer>
    );
  }
);

export default UserTagsDrawer;
