import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/Layout';

const AdminAppointments: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout admin>
      <div>TODO: Appointments</div>
    </Layout>
  );
};

export default AdminAppointments;
