import { types } from 'mobx-state-tree';

export const RulerStore = types
  .model({
    open: types.optional(types.boolean, false),
    paletteOpen: types.optional(types.boolean, false),
  })
  .actions(self => {
    const setRulerOpen = (value: boolean) => {
      self.open = value;
    };
    const setPaletteOpen = (value: boolean) => {
      self.paletteOpen = value;
    };
    return {
      setRulerOpen,
      setPaletteOpen,
    };
  });
