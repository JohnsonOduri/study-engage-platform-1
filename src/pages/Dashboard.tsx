import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">
            {user?.role === "student" 
              ? "Track your academic progress and access your courses" 
              : "Manage your classes and track student performance"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">My Courses</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-muted-foreground text-sm">Active courses</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Attendance</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">92%</p>
            <p className="text-muted-foreground text-sm">Overall attendance</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Upcoming</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-muted-foreground text-sm">Scheduled events</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Messages</h3>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-muted-foreground text-sm">Unread messages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border shadow-subtle">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b">
                  <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{i}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Assignment submitted</h4>
                    <p className="text-muted-foreground text-sm">You submitted "Introduction to React" assignment</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
            <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pb-3 border-b last:border-0">
                  <p className="font-medium">Database Design Assignment</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Due in 3 days</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
