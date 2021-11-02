import BaseApi from './BaseApi';
import { ApiConfig, DEFAULT_API_CONFIG } from './config';

type Response<T> = API.GeneralResponse<T>;

export class Api extends BaseApi {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config);
  }

  /**
   * User registration
   *
   * Note:
   * "local" in the url means we are using Strapi's default register method/user management
   * and not some external OAuth provider (e.g. Github, Google, etc.).
   */
  async register(params: API.AuthRegister): Promise<Response<API.RES.Auth>> {
    const response = await this.api.post(`auth/local/register`, params, {});

    if (!response.ok) return this.handleError(response);

    const successResponse = this.handleSuccess(response);
    if (successResponse.data?.jwt.length) {
      this.setToken(successResponse.data?.jwt);
    }
    return successResponse;
  }

  /**
   * Change password for the authenticated user
   */
  async changePassword(
    params: API.AuthChangePassword
  ): Promise<Response<API.RES.User>> {
    const url = 'users/change-password';
    const response = await this.api.put(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Sends a link via email to reset user's password
   */
  async forgotPassword(
    params: API.AuthForgotPassword
  ): Promise<Response<API.RES.AuthForgotPassword>> {
    const url = 'auth/forgot-password';
    const response = await this.api.post(url, params, {});
    return this.handleResponse(response);
  }

  /**
   * Resets user's password
   */
  async resetPassword(
    params: API.AuthResetPassword
  ): Promise<Response<API.RES.Auth>> {
    const response = await this.api.post('auth/reset-password', params, {});
    return this.handleResponse(response);
  }

  /**
   * User login
   *
   * Note:
   * "local" in the url means we are using Strapi's default login method/user management
   * and not some external OAuth provider (e.g. Github, Google, etc.).
   */
  async login(params: API.AuthLogin): Promise<Response<API.RES.Auth>> {
    const response = await this.api.post(`auth/local`, params, {});

    if (!response.ok) return this.handleError(response);

    const successResponse = this.handleSuccess(response);
    if (successResponse.data?.jwt.length) {
      this.setToken(successResponse.data?.jwt);
    }
    return successResponse;
  }

  /**
   * User logout
   */
  async logout() {
    // Currently no logout endpoint available in Strapi backend, just clear token:
    this.setToken(undefined);
  }

  /**
   * Fetch app settings (app name, logo etc.)
   */
  async getSettings(
    params: API.GetSettings = {}
  ): Promise<Response<API.RES.GetSettings>> {
    const response = await this.api.get(`settings`, params, {});
    return this.handleResponse(response);
  }

  /**
   * Fetch main navigation
   */
  async getNavigation(
    params: API.GetNavigation = {}
  ): Promise<Response<API.RES.GetNavigation>> {
    const response = await this.api.get(`navigation`, params, {});
    return this.handleResponse(response);
  }

  /**
   * Fetch data for the front page
   */
  async getFrontPage(
    params: API.GetFrontPage = {}
  ): Promise<Response<API.RES.GetFrontPage>> {
    const response = await this.api.get(`front-page`, params, {});
    return this.handleResponse(response);
  }

  /**
   * Fetch data for the front page
   */
  async getContentPages({
    ...params
  }: API.GetContentPages): Promise<Response<API.RES.GetContentPages>> {
    const response = await this.api.get(`pages`, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch appointments
   */
  async getAppointments(
    params: API.GetAppointments = {}
  ): Promise<Response<API.RES.GetAppointments>> {
    const url = `appointments`;
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch user's own appointments
   */
  async getUserAppointments(
    params: API.GetUserAppointments = {}
  ): Promise<Response<API.RES.GetUserAppointments>> {
    const url = `users/me/appointments`;
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
    const url = `appointments/${id}/cancel`;
    const response = await this.api.post(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Make appointment
   */
  async makeAppointment({
    id,
    ...params
  }: API.MakeAppointment): Promise<Response<API.RES.MakeAppointment>> {
    const url = `appointments/${id}/make`;
    const response = await this.api.post(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch test categories (and tests within)
   */
  async getTestCategories(
    params: API.GetTestCategories = {}
  ): Promise<Response<API.RES.GetTestCategories>> {
    const url = `test-categories`;
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }

  /**
   * Fetch exercises
   */
  async getExercises(
    params: API.GetExercises = {}
  ): Promise<Response<API.RES.GetExercises>> {
    const url = `tests?type=exercise`;
    const response = await this.api.get(url, params, this.auth());
    return this.handleResponse(response);
  }
}

export const api = new Api();

export default api;
