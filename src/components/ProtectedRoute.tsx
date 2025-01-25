"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import { useAuth } from "@/context/AuthProvider";

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return (
      <div>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondaryBackground w-full h-full flex flex-col">
      <Header />

      <div className="mx-[30px] mb-[30px] flex-1 bg-white rounded-[7px]">
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;
