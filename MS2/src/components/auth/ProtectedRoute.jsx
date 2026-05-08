import { Navigate, useLocation } from "react-router-dom";
import {
  getCurrentUserRole,
  getDashboardRouteByRole,
  getStoredCurrentUser,
  normalizeUserRole,
} from "@/utils/roleRoutes";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const currentUser = getStoredCurrentUser();
  const currentRole = getCurrentUserRole(currentUser);

  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles.map(normalizeUserRole).filter(Boolean)
    : [normalizeUserRole(allowedRoles)].filter(Boolean);

  if (!currentUser || !currentRole) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!allowed.includes(currentRole)) {
    return (
      <Navigate
        to={getDashboardRouteByRole(currentRole)}
        replace
      />
    );
  }

  return children;
}