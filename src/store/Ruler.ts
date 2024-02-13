import { types } from 'mobx-state-tree';

export const RulerStore = types
  .model({
    open: types.optional(types.boolean, false),
  })
  .actions(self => {
    const setRulerOpen = (value: boolean) => {
      self.open = value;
    };
    return {
      setRulerOpen,
    };
  });
