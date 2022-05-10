import { Instance, types, flow, cast, getSnapshot } from 'mobx-state-tree';
import api from '../services/api/Api';
import { UserInterestsModel } from './models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const UserInterestsStoreStates = [
  'IDLE' as const,
  'CREATING' as const,
  'EDITING' as const,
  'DELETING' as const,
  'ERROR' as const,
];

export const UserInterestsStore = types
  .model({
    state: types.enumeration('State', States),
    userInterestsState: types.enumeration('State', UserInterestsStoreStates),
    data: types.maybe(UserInterestsModel),
  })
  .views(self => ({
    get goalsInfo() {
      if (self.data) {
        const { userInterests, ...userInterestsInfo } = self.data;
        return userInterestsInfo;
      }
      return undefined;
    },
    get userInterests() {
      return self.data?.userInterests
        ? getSnapshot(self.data.userInterests)
        : [];
    },
  }))
  .actions(self => {
    const fetchUserInterests = flow(function* (
      params: API.GetUserInterests = {}
    ) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetGoals> =
        yield api.getGoals(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    // const updateGoal = (updatedGoal: Goal) => {
    //   if (self.data) {
    //     const updatedGoals = self.data.goals.map(goal => {
    //       if (goal.id !== updatedGoal.id) return goal;
    //       return updatedGoal;
    //     });
    //     self.data = {
    //       ...self.data,
    //       goals: cast(updatedGoals),
    //     };
    //   }
    // };

    return {
      fetchUserInterests,
    };
  });

export interface IUserInterestsStore
  extends Instance<typeof UserInterestsStore> {}
