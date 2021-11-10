import { types } from 'mobx-state-tree';

export const OutcomeTypeModel = types.enumeration([
  'total_points',
  'suitablitity_of_answers',
  'from_template',
]);
