const API_PREFIX = '/api';
const API_VERSION = {
  V1: 'v1',
};

export const API_ROUTES = {
  EXECUTE_COMMAND: `${API_PREFIX}/${API_VERSION.V1}/exec`,
} as const;
