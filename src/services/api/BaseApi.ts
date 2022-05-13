import { ApisauceInstance, create, ApiResponse } from 'apisauce';
import { toCamelCase, transformKeys } from '../../utils/objects';
import STORAGE from '../storage';
import { ApiConfig, DEFAULT_API_CONFIG } from './config';

export abstract class BaseApi {
  private config: ApiConfig;
  protected api: ApisauceInstance;
  protected token: string | undefined;

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    const { tokenStorageKey, ...apiConfig } = config;
    this.token = STORAGE.read({ key: tokenStorageKey });
    this.config = config;
    this.api = create({
      ...apiConfig,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  protected auth() {
    if (!this.token) return {};
    return {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  protected setToken(token?: string) {
    this.token = token;
    STORAGE.write({ key: this.config.tokenStorageKey, value: token ?? null });
  }

  protected handleSuccess(response: ApiResponse<any>): API.Success<any> {
    return {
      kind: 'ok',
      data: transformKeys(response.data, toCamelCase),
    };
  }

  protected handleError(response: ApiResponse<any>) {
    const apiError = this.composeApiError(response);
    return apiError;
  }

  protected handleResponse(response: ApiResponse<any>) {
    if (!response.ok) return this.handleError(response);
    return this.handleSuccess(response);
  }

  private composeApiError(response: ApiResponse<any>): API.Problem {
    switch (response.problem) {
      case 'CONNECTION_ERROR':
        return { kind: 'cannot-connect', temporary: true };
      case 'NETWORK_ERROR':
        return { kind: 'cannot-connect', temporary: true };
      case 'TIMEOUT_ERROR':
        return { kind: 'timeout', temporary: true };
      case 'SERVER_ERROR':
        return { kind: 'server' };
      case 'UNKNOWN_ERROR':
        return { kind: 'unknown', temporary: true };
      case 'CLIENT_ERROR':
        switch (response.status) {
          case 401:
            return { kind: 'unauthorized', data: response.data };
          case 403:
            return { kind: 'forbidden', data: response.data };
          case 404:
            return { kind: 'not-found', data: response.data };
          default:
            return { kind: 'rejected', data: response.data };
        }
      default:
        return { kind: 'unknown', temporary: true };
    }
  }
}

export default BaseApi;
