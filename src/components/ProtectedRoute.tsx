import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log(user);

  useEffect(() => {
    if (user === null) {
      // If user is not authenticated, show 403 forbidden error page
      setLoading(false);
    } else {
      // User is authenticated, proceed with page rendering
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Loading spinner if status is unknown
  }

  if (user === null) {
    // Show 403 forbidden error if user is not authenticated
    return (
      <div>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  // Render children (protected content) if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
