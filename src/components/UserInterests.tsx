import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import UserInterestsModal from './UserInterestsModal';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests, setUserTags },
  } = useStore();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  const postTags = () => {
    setUserTags({ tags: [2] });
  };

  return (
    <>
      Sinua voi kiinnostaa
      <Button id={'testi'} onClick={postTags}>
        testaa tageja
      </Button>
      <ul>
        {userInterests.map(interest => (
          <li>{interest.title}</li>
        ))}
      </ul>
      <UserInterestsModal />
    </>
  );
});
