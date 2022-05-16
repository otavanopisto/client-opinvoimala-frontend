import { StorageKey } from '../storage';

const URL = {
  local: 'http://localhost:1337',
  stage: 'https://opinvoimala-api.stage.geniem.io',
  production: 'https://opinvoimala-api.production.geniem.io',
};

const getBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isStage = window.location.hostname.includes('.stage.geniem.io');
  const isProduction = !isStage && process.env.NODE_ENV === 'production';

  if (isDevelopment) return URL.local;
  if (isProduction) return URL.production;
  return URL.stage;
};

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  tokenStorageKey: StorageKey;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: getBaseUrl(),
  timeout: 30000,
  tokenStorageKey: 'AUTH_TOKEN',
};

export const ADMIN_API_CONFIG: ApiConfig = {
  baseURL: getBaseUrl(),
  timeout: 30000,
  tokenStorageKey: 'ADMIN_AUTH_TOKEN',
};
