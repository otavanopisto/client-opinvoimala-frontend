import { createContext, useContext } from 'react';
import { AdminRootStore } from './AdminRootStore';

const AdminStoreContext = createContext<AdminRootStore | undefined>(undefined);

export const AdminStoreProvider = AdminStoreContext.Provider;

export const useAdminStore = () => {
  const store = useContext(AdminStoreContext);
  if (!store) {
    throw new Error(
      'Cannot use `useAdminStore` outside of a AdminStoreProvider'
    );
  }
  return store;
};
