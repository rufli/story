import { getActiveRoute } from '../routes/url-parser';
import { TOKEN_KEY } from "../config";

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token === 'null' || token === 'undefined') {
      return null;
    }

    return token;
  } catch (error) {
    console.error('getToken: error:', error);
    return null;
  }
}

export function putToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('getLogout: error:', error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '/';
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getToken();

  if (!isLogin) {
    location.hash = '/login';
    return null;
  }

  return page;
}

export function getLogout() {
  removeToken();
  location.hash = '/login';
    window.location.reload();
}
