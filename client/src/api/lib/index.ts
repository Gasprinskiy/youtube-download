import { ofetch } from 'ofetch';

import { getApiUrl } from '../../shared/utils/env';

export const $api = ofetch.create({
  baseURL: getApiUrl(),
  timeout: 180000,
  credentials: 'include',
});
