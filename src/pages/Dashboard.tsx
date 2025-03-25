
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  if (user?.role === "teacher") {
    return <Navigate to="/admin" />; // Teachers now also go to admin dashboard with teacher view
  }

  return <Navigate to="/student" />;
};

export default Dashboard;
