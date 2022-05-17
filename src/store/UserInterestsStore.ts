import { Instance, types, flow, cast, getSnapshot } from 'mobx-state-tree';
import api from '../services/api/Api';
import { UserInterestsModel } from './models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const UserTagsStates = [
  'IDLE' as const,
  'PROCESSING' as const,
  'ERROR' as const,
];

export const UserInterestsStore = types
  .model({
    state: types.enumeration('State', States),
    userTagsState: types.enumeration('State', UserTagsStates),
    data: types.array(UserInterestsModel),
  })
  .views(self => ({
    get userInterests() {
      return self.data ? getSnapshot(self.data) : [];
    },
  }))
  .actions(self => {
    const fetchUserInterests = flow(function* (
      params: API.GetUserInterests = {}
    ) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetUserInterests> =
        yield api.getUserInterests(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      fetchUserInterests,
    };
  });

export interface IUserInterestsStore
  extends Instance<typeof UserInterestsStore> {}
