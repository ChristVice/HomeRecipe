import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <React.Fragment>
            <Navigate to="/login" />
          </React.Fragment>
        )
      }
    />
  );
};

export default ProtectedRoute;
