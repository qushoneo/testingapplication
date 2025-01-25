"use client";

import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthProvider";

const ProjectsPage = () => {
  const { logout } = useAuth();

  return <ProtectedRoute></ProtectedRoute>;
};

export default ProjectsPage;
