import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout';
import LinkList from '../../components/LinkList';
import { rt } from '../../routes/routes';
import { adminPath } from '../../routes/routesAdmin';
import { Link } from '../../store/models';

const AdminFrontPage: React.FC = () => {
  const { t } = useTranslation();

  const baseLink = {
    internal: null,
    external: null,
    page: null,
    test: null,
    exercise: null,
  };

  const links: Link[] = [
    {
      ...baseLink,
      id: 'admin_appointments',
      label: rt('admin.appointments'),
      type: 'internal',
      internal: adminPath('admin.appointments'),
    },
  ];

  return (
    <Layout admin wrapperSize="sm">
      <LinkList list={{ title: t('route.admin.root'), links }} />
    </Layout>
  );
};

export default AdminFrontPage;
