import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../store/storeContext';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
  } = useStore();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  return (
    <>
      Sinua voi kiinnostaa
      <button>testaa tageja</button>
      <ul>
        {userInterests.map(interest => (
          <li>{interest.title}</li>
        ))}
      </ul>
    </>
  );
});
