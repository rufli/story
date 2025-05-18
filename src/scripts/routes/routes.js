import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import SavedPage from '../pages/saved/saved-page';

import StoryPage from '../pages/story/story-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/story': () => checkAuthenticatedRoute(new StoryPage()),
  '/saved': () => checkAuthenticatedRoute(new SavedPage()),
};
