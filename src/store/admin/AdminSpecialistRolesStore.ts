import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';

export const SpecialistRoleModel = types.model({
  id: types.maybeNull(types.identifierNumber),
  role: types.maybeNull(types.string),
});

export interface SpecialistRole
  extends SnapshotOut<typeof SpecialistRoleModel> {}
export interface SpecialistRoleIn
  extends SnapshotIn<typeof SpecialistRoleModel> {}

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

export const AdminSpecialistRolesStore = types
  .model({
    state: types.enumeration('State', States),
    data: types.array(SpecialistRoleModel),
  })
  .views(self => ({
    get roles() {
      return getSnapshot(self.data);
    },

    get specialistRoleOptions() {
      return this.roles.map(({ id, role }) => ({
        id: id ?? -1,
        label: role ?? '',
      }));
    },

    getSpecialistRoleOption(id?: number | null) {
      const roles = getSnapshot(self.data);
      const role = id && id > 0 ? roles.find(role => role.id === id) : roles[0];
      return {
        id: role?.id ?? -1,
        label: role?.role ?? '',
      };
    },
  }))
  .actions(self => {
    let initialState = {};

    const fetchSpecialistRoles = flow(function* (
      params: API.Admin.GetSpecialistsRoles = {}
    ) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.Admin.RES.GetSpecialistRoles> =
        yield adminApi.getSpecialistsRoles(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
      fetchSpecialistRoles,
    };
  });

export interface IAdminSpecialistRolesStore
  extends Instance<typeof AdminSpecialistRolesStore> {}
