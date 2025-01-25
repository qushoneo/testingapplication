"use client";

import { useAuth } from "../../context/AuthProvider";
import Button from "@/components/Button";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProjectsPage = () => {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1>Your Projects</h1>
        <Button label="Logout" onClick={logout}>
          Logout
        </Button>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectsPage;
