const baseUrl = import.meta.env.VITE_GLOB_API_URL || '';
const queryUrl = baseUrl + (import.meta.env.VITE_GLOB_API_PATH || '/graphql/query');
const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL
const product = import.meta.env.VITE_PRODUCT

export {
  queryUrl,
  baseUrl,
  homePageUrl,
}

export * from './request';
export * from './dsl';
export * from './crypto';

export function redirectHomePage(data?: any) {
  if (isElectronEnv()) {
    window.electronAPI.setGlobal(data);
    window.electronAPI.sendLoginSuccess(data);
  } else {
    window.location.replace(`${homePageUrl}?token=${data.token}`); 
  }
}

export function isElectronEnv(): boolean {
  if (product === 'electron') {
    return true
  }
  return false
}