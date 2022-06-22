import { cast, flow, getSnapshot, Instance, types } from 'mobx-state-tree';
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

    const addGoal = flow(function* (params: API.CreateGoal) {
      self.goalState = 'CREATING';

      const response: API.GeneralResponse<API.RES.CreateGoal> =
        yield api.createGoal(params);

      if (response.kind === 'ok') {
        self.goalState = 'IDLE';
        fetchGoals();
        return { success: true };
      } else {
        self.goalState = 'ERROR';
        return { success: false };
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

    const editGoal = flow(function* (params: API.EditGoal) {
      self.goalState = 'EDITING';

      const response: API.GeneralResponse<API.RES.EditGoal> =
        yield api.editGoal(params);

      if (response.kind === 'ok') {
        self.goalState = 'IDLE';
        const updatedGoal = response.data;
        updateGoal(updatedGoal);
        return { success: true };
      } else {
        self.goalState = 'ERROR';
        return { success: false };
      }
    });

    const markGoalDone = flow(function* (params: API.MarkGoalDone) {
      self.goalState = 'EDITING';

      const response: API.GeneralResponse<API.RES.MarkGoalDone> =
        yield api.markGoalDone(params);

      if (response.kind === 'ok') {
        self.goalState = 'IDLE';
        const updatedGoal = response.data;
        updateGoal(updatedGoal);

        if (self.data) {
          self.data = {
            ...self.data,
            doneTotal:
              self.data?.doneTotal !== null
                ? cast(self.data?.doneTotal + 1)
                : null,
          };
        }

        return { success: true };
      } else {
        self.goalState = 'ERROR';
        return { success: false };
      }
    });

    const deleteGoal = flow(function* (params: API.DeleteGoal) {
      self.goalState = 'DELETING';

      const response: API.GeneralResponse<API.RES.DeleteGoal> =
        yield api.deleteGoal(params);

      if (response.kind === 'ok') {
        self.goalState = 'IDLE';
        fetchGoals();
        return { success: true };
      } else {
        self.goalState = 'ERROR';
        return { success: false };
      }
    });

    return {
      fetchGoals,
      addGoal,
      editGoal,
      markGoalDone,
      deleteGoal,
    };
  });

export interface IGoalsStore extends Instance<typeof GoalsStore> {}
