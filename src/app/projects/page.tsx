"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";
import Button from "@/components/Button";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProjectsPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

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
