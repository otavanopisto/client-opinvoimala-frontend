type TargetStorage = 'local' | 'session';

export type StorageKey =
  | 'AUTH_TOKEN'
  | 'TESTS_IN_PROGRESS'
  | 'ADMIN_AUTH_TOKEN'
  | 'ADMIN_USER'
  | 'FEEDBACK';

interface StorageProps {
  key: StorageKey;
  target?: TargetStorage;
}

const DEFAULT_TARGET: TargetStorage = 'local';

interface WriteStorageProps extends StorageProps {
  value: Object | null;
}

const read = ({ key, target = DEFAULT_TARGET }: StorageProps) => {
  switch (target) {
    case 'session':
      if (window.sessionStorage) {
        const value = window.sessionStorage.getItem(key);
        if (value) return JSON.parse(value);
      }
      break;
    case 'local':
    default:
      if (window.localStorage) {
        const value = window.localStorage.getItem(key);
        if (value) return JSON.parse(value);
      }
      break;
  }
  return null;
};

const write = ({ key, value, target = DEFAULT_TARGET }: WriteStorageProps) => {
  switch (target) {
    case 'session':
      if (window.sessionStorage)
        window.sessionStorage.setItem(key, JSON.stringify(value));
      break;
    case 'local':
    default:
      if (window.localStorage)
        window.localStorage.setItem(key, JSON.stringify(value));
      break;
  }
};

export const Storage = {
  read,
  write,
};

export default Storage;
