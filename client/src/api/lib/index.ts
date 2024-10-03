import { ofetch } from "ofetch";

export const $api = ofetch.create({
  baseURL: 'http://localhost:3000',
  timeout: 180000,
  credentials: 'include',
})