import { toSnakeCase, transformKeys } from '../../utils/objects';
import BaseApi from './BaseApi';
import { ADMIN_API_CONFIG, ApiConfig } from './config';

type Response<T> = API.GeneralResponse<T>;

export class AdminApi extends BaseApi {
  constructor(config: ApiConfig = ADMIN_API_CONFIG) {
    super(config);
  }

  /**
   * Admin login
   */
  async login(params: API.Admin.Login): Promise<Response<API.Admin.RES.Login>> {
    const response = await this.api.post(`/admin/login`, params, {});

    if (!response.ok) return this.handleError(response);

    const successResponse = this.handleSuccess(response);
    const { data } = successResponse.data;

    if (data?.token.length) {
      this.setToken(data?.token);
    }
    return { ...successResponse, data };
  }

  /**
   * Get me
   */
  async getMe(params: API.Admin.GetMe): Promise<Response<API.Admin.RES.GetMe>> {
    const url = `/admin/users/me`;
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch appointments
   */
  async getAppointments(
    params: API.GetAppointments = {}
  ): Promise<Response<API.RES.GetAppointments>> {
    const url = '/admin-api/appointments';
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch appointment specialists
   */
  async getAppointmentSpecialists(
    params: API.Admin.GetAppointmentSpecialists = {}
  ): Promise<Response<API.Admin.RES.GetAppointmentSpecialists>> {
    const url = '/admin-api/appointment-specialists';
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment({
    id,
    ...params
  }: API.CancelAppointment): Promise<Response<API.RES.CancelAppointment>> {
    const url = `/admin-api/appointments/${id}/cancel`;
    const response = await this.api.post(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Create appointment
   */
  async createAppointment({
    id,
    ...params
  }: API.Admin.CreateAppointment): Promise<
    Response<API.Admin.RES.CreateAppointment>
  > {
    const url = `/admin-api/appointments`;
    const response = await this.api.post(
      url,
      transformKeys(params, toSnakeCase),
      this.auth()
    );
    return this.handleResponse(response);
  }

  /**
   * Edit appointment
   */
  async editAppointment({
    repeatScope,
    appointment,
  }: API.Admin.EditAppointment): Promise<
    Response<API.Admin.RES.EditAppointment>
  > {
    const { id, ...params } = appointment;
    const url = `/admin-api/appointments/${id}?repeatScope=${repeatScope}`;
    const response = await this.api.put(
      url,
      transformKeys(params, toSnakeCase),
      this.auth()
    );
    return this.handleResponse(response);
  }

  /**
   * Delete appointment
   */
  async deleteAppointment({
    id,
    ...params
  }: API.Admin.DeleteAppointment): Promise<
    Response<API.Admin.RES.DeleteAppointment>
  > {
    const url = `/admin-api/appointments/${id}`;
    const response = await this.api.delete(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch specialist roles
   */
  async getSpecialistsRoles(
    params: API.Admin.GetSpecialistsRoles = {}
  ): Promise<Response<API.Admin.RES.GetSpecialistRoles>> {
    const url = '/specialist-roles';
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Create appointment specialist
   */
  async createAppointmentSpecialist({
    id,
    ...params
  }: API.Admin.CreateAppointmentSpecialist): Promise<
    Response<API.Admin.RES.CreateAppointmentSpecialist>
  > {
    const url = `/admin-api/appointment-specialists`;
    const response = await this.api.post(
      url,
      transformKeys(params, toSnakeCase),
      this.auth()
    );
    return this.handleResponse(response);
  }

  /**
   * Edit appointment specialist
   */
  async editAppointmentSpecialist({
    id,
    ...params
  }: API.Admin.EditAppointmentSpecialist): Promise<
    Response<API.Admin.RES.EditAppointmentSpecialist>
  > {
    const url = `/admin-api/appointment-specialists/${id}`;
    const response = await this.api.put(
      url,
      transformKeys(params, toSnakeCase),
      this.auth()
    );
    return this.handleResponse(response);
  }

  /**
   * Delete appointment specialist
   */
  async deleteAppointmentSpecialist({
    id,
    ...params
  }: API.Admin.DeleteAppointmentSpecialist): Promise<
    Response<API.Admin.RES.DeleteAppointmentSpecialist>
  > {
    const url = `/admin-api/appointment-specialists/${id}`;
    const response = await this.api.delete(
      url,
      transformKeys(params, toSnakeCase),
      this.auth()
    );
    return this.handleResponse(response);
  }
}

export const adminApi = new AdminApi();

export default adminApi;
