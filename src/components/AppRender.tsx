import { useRoutes } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { authenticatedRoutes, publicRoutes } from '../routes';

// Renders auth routes when unauthenticated, app routes when authenticated
export const AppRender: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const routes = isAuthenticated ? authenticatedRoutes : publicRoutes;
  const routeElement = useRoutes(routes);

  if (isLoading) return null;

  return routeElement;
};
