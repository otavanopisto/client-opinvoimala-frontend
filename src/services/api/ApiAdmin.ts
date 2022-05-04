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
    const response = await this.api.post(`admin/login`, params, {});

    if (!response.ok) return this.handleError(response);

    const successResponse = this.handleSuccess(response);
    const { data } = successResponse.data;

    if (data?.token.length) {
      this.setToken(data?.token);
    }
    return { ...successResponse, data };
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
}

export const adminApi = new AdminApi();

export default adminApi;
