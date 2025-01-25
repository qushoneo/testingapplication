"use client";

import Button from "src/components/Button";
import ProtectedRoute from "src/components/ProtectedRoute";
import { useAuth } from "src/context/AuthProvider";

const ProjectsPage = () => {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="mx-[30px] mb-[30px] flex-1 bg-white"></div>
    </ProtectedRoute>
  );
};

export default ProjectsPage;
