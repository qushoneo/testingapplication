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

      <div className="flex-1 flex overflow-auto ml-[30px] mr-[15px] pr-[15px] mb-[15px] h-fit">
        <div className="flex-1 bg-white rounded-[7px] mb-[15px] h-fit">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
