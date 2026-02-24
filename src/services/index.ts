// Services are imported directly from their domain files:
// @services/auth.service, @services/onboarding.service,
// @services/settings.service, @services/verification.service
// @services/user.service

export { type AuthStatusResponse, type User, getAuthStatus, logout, logoutAll } from './user.service';
