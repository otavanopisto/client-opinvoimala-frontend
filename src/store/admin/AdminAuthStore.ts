import {
  Instance,
  types,
  flow,
  cast,
  SnapshotOut,
  SnapshotIn,
  getParent,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';
import Storage from '../../services/storage';

const States = ['IDLE' as const, 'PROCESSING' as const, 'ERROR' as const];

const AdminUserModel = types.model({
  id: types.number,
  firstname: types.string,
  lastname: types.string,
});

export interface IAdminUserModel extends Instance<typeof AdminUserModel> {}
export interface AdminUser extends SnapshotOut<typeof AdminUserModel> {}
export interface AdminUserIn extends SnapshotIn<typeof AdminUserModel> {}

export const AdminAuthStore = types
  .model({
    state: types.enumeration('State', States),

    jwt: types.optional(
      types.maybeNull(types.string),
      Storage.read({ key: 'ADMIN_AUTH_TOKEN' })
    ),
    user: types.optional(
      types.maybeNull(AdminUserModel),
      Storage.read({ key: 'ADMIN_USER' })
    ),
  })
  .views(self => ({
    get isLoggedIn() {
      return !!self.jwt?.length;
    },
    get adminFirstName() {
      return self.user?.firstname ?? '';
    },
    get adminLastName() {
      return self.user?.lastname ?? '';
    },
    get adminName() {
      const lastName = this.adminLastName;
      const shortLastName = lastName?.length ? `${lastName[0]}.` : '';
      return `${this.adminFirstName} ${shortLastName}`;
    },
    get adminFullName() {
      return `${this.adminFirstName} ${this.adminLastName}`;
    },
  }))
  .actions(self => {
    const login = flow(function* (params: API.Admin.Login) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.Login> =
        yield adminApi.login(params);

      if (response.kind === 'ok') {
        self.user = cast(response.data.user);
        self.jwt = cast(response.data.token);
        Storage.write({
          key: 'ADMIN_USER',
          value: self.user,
        });
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const logout = () => {
      self.state = 'PROCESSING';
      self.jwt = null;
      self.user = null;
      Storage.write({ key: 'ADMIN_AUTH_TOKEN', value: null });
      Storage.write({ key: 'ADMIN_USER', value: null });

      const { appointments, specialists } = getParent(self);
      appointments.reset();
      specialists.reset();

      self.state = 'IDLE';
    };

    return {
      login,
      logout,
    };
  });

export interface IAdminAuthStore extends Instance<typeof AdminAuthStore> {}
