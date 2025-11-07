// // import React from "react";
// // import { Navigate } from "react-router-dom";
// // import { useAuth } from "../hooks/useAuth";

// // /**
// //  * @param {{ children: React.ReactNode, requiredRoles?: string[] }} props
// //  */
// // const ProtectedRoute = ({ children, requiredRoles = [] }) => {
// //   const { roles, loading } = useAuth();

// //   if (loading) return <div>Loading...</div>;

// //   if (!roles || roles.length === 0) {
// //     // Not logged in
// //     return <Navigate to="/" replace />;
// //   }

// //   const hasRequiredRole =
// //     requiredRoles.length === 0 ||
// //     requiredRoles.some((role) => roles.includes(role));

// //   if (!hasRequiredRole) {
// //     // Unauthorized
// //     return <Navigate to="/unauthorized" replace />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;

// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { LoginContext } from "../context/LoginContext";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRoles?: string[];
// }
// const ProtectedRoute = ({ children, requiredRoles = [] }:any) => {
//   const { isLoggedIn, user, loading } = useContext(LoginContext);

//   if (loading) return <div>Loading...</div>;

//   if (!isLoggedIn || !user?.role) {
//     // not logged in
//     return <Navigate to="/login" replace />;
//   }

//   // Check role access
//   const hasRequiredRole =
//     requiredRoles.length === 0 || requiredRoles.includes(user.role);

//   if (!hasRequiredRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


// src/components/ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "student")[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { isLoggedIn, user, loading } = useContext(LoginContext);

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn || !user?.role) {
    console.warn("User not logged in, redirecting...");
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole =
    requiredRoles.length === 0 || requiredRoles.includes(user.role);

  if (!hasRequiredRole) {
    console.warn("Unauthorized access attempt, redirecting...");
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
