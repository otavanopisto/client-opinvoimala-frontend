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
}

export const adminApi = new AdminApi();

export default adminApi;
