const baseUrl = import.meta.env.VITE_GLOB_API_URL || '';
const queryUrl = baseUrl + (import.meta.env.VITE_GLOB_API_PATH || '/graphql/query');
const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL

export {
  queryUrl,
  baseUrl,
  homePageUrl,
}

export * from './request';
export * from './dsl';
export * from './crypto';