import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../store/storeContext';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state },
  } = useStore();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  return <div>UserInterests</div>;
});
