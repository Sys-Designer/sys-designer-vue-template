const baseUrl = import.meta.env.VITE_GLOB_API_URL || '';
const queryUrl = baseUrl + (import.meta.env.VITE_GLOB_API_PATH || '/graphql/query');

export {
  queryUrl,
  baseUrl,
}

export * from './request';
export * from './dsl';