"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import { useAuth } from "@/context/AuthProvider";

interface ProtectedRouteProps {
  children?: ReactNode;
  className?: string;
  leftSideBar?: ReactNode | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  leftSideBar = null,
}) => {
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
      <Header haveSideBar={!!leftSideBar} />

      <div
        className={`flex-1 flex overflow-auto  mr-[15px] pr-[15px] mb-[15px] h-fit ${
          leftSideBar ? "" : "ml-[30px]"
        }`}
      >
        {leftSideBar}
        <div className="flex-1 bg-white rounded-[7px] mb-[15px] min-h-[calc(100%-15px)] h-fit flex">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
