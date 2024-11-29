/* eslint-disable react/prop-types */

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Protector = ({ children }) => {
  const { loading, whoMe } = useAuth();
  const location = useLocation();

  // Show a loading state while user data is being fetched
  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );
  }

  // Redirect to the homepage if the user is not authenticated or not an admin
  if (!whoMe || whoMe.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render children if user is authenticated and an admin
  return <>{children}</>;
};

export default Protector;
