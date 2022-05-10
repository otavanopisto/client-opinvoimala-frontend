import { Instance, types, flow, cast, getSnapshot } from 'mobx-state-tree';
import api from '../services/api/Api';
import { Goal, GoalsModel } from './models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const GoalStates = [
  'IDLE' as const,
  'CREATING' as const,
  'EDITING' as const,
  'DELETING' as const,
  'ERROR' as const,
];

export const GoalsStore = types
  .model({
    state: types.enumeration('State', States),
    goalState: types.enumeration('State', GoalStates),
    data: types.maybe(GoalsModel),
  })
  .views(self => ({
    get goalsInfo() {
      if (self.data) {
        const { goals, ...goalsInfo } = self.data;
        return goalsInfo;
      }
      return undefined;
    },
    get goals() {
      return self.data?.goals ? getSnapshot(self.data.goals) : [];
    },
  }))
  .actions(self => {
    const fetchGoals = flow(function* (params: API.GetGoals = {}) {
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

    const updateGoal = (updatedGoal: Goal) => {
      if (self.data) {
        const updatedGoals = self.data.goals.map(goal => {
          if (goal.id !== updatedGoal.id) return goal;
          return updatedGoal;
        });
        self.data = {
          ...self.data,
          goals: cast(updatedGoals),
        };
      }
    };

    return {
      fetchGoals,
      addGoal,
      editGoal,
      markGoalDone,
      deleteGoal,
    };
  });

export interface IGoalsStore extends Instance<typeof GoalsStore> {}
