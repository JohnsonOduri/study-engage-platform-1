
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Calendar, 
  FileText, 
  Trophy, 
  MessageSquare, 
  Clock, 
  BookOpen,
  Laptop,
  CheckCircle,
  Bot,
  Sparkles,
  Brain,
  FileQuestion
} from "lucide-react";
import { MyCourses } from "@/components/student/MyCourses";
import { MyAssignments } from "@/components/student/MyAssignments";
import { MyProgress } from "@/components/student/MyProgress";
import { StudyPlanner } from "@/components/student/StudyPlanner";
import { DiscussionForums } from "@/components/student/DiscussionForums";
import { LeaderboardView } from "@/components/student/LeaderboardView";
import { CodeEditor } from "@/components/student/CodeEditor";
import { QuizGenerator } from "@/components/student/QuizGenerator";

const StudentDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Set initial tab based on location state if provided
  useEffect(() => {
    if (location.state && location.state.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state]);

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

  // Redirect admins to admin dashboard
  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses, assignments, and progress
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span className="hidden md:inline">My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden md:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
              <Brain className="h-4 w-4" />
              <span className="hidden md:inline">AI Study Planner</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden md:inline">AI Quiz Generator</span>
            </TabsTrigger>
            <TabsTrigger value="forums" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Forums</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden md:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="code-editor" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />
              <span className="hidden md:inline">Code Editor</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StudentStatCard
                title="Enrolled Courses"
                value="5"
                subtitle="Currently active"
                icon={<Book className="h-5 w-5 text-primary" />}
              />
              <StudentStatCard
                title="Assignments Due"
                value="3"
                subtitle="This week"
                icon={<FileText className="h-5 w-5 text-primary" />}
              />
              <StudentStatCard
                title="XP Points"
                value="2,540"
                subtitle="Level 15"
                icon={<Trophy className="h-5 w-5 text-primary" />}
              />
              <StudentStatCard
                title="Study Time"
                value="24h"
                subtitle="This week"
                icon={<Clock className="h-5 w-5 text-primary" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
                <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Database Design Assignment</h4>
                        <p className="text-muted-foreground text-sm">Web Development Course</p>
                        <p className="text-xs text-muted-foreground mt-1">Due in {i} day{i !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
                <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
                <div className="space-y-4">
                  {[
                    { name: "Perfect Attendance", desc: "Attended 7 classes in a row", xp: 150 },
                    { name: "Quiz Master", desc: "Scored 100% on 3 quizzes", xp: 200 },
                    { name: "Consistent Learner", desc: "Completed daily tasks for 5 days", xp: 100 },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-muted-foreground text-sm">{badge.desc}</p>
                        <p className="text-xs text-primary mt-1">+{badge.xp} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Features
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Study Planner</h4>
                      <p className="text-muted-foreground text-sm">Generate personalized study schedules based on your courses</p>
                      <button 
                        className="text-xs text-primary mt-1 flex items-center gap-1"
                        onClick={() => setActiveTab("planner")}
                      >
                        Try it now <Sparkles className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                      <FileQuestion className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Quiz Generator</h4>
                      <p className="text-muted-foreground text-sm">Create custom quizzes on any topic to test your knowledge</p>
                      <button 
                        className="text-xs text-primary mt-1 flex items-center gap-1"
                        onClick={() => setActiveTab("quizzes")}
                      >
                        Try it now <Sparkles className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <MyCourses />
          </TabsContent>
          
          <TabsContent value="assignments">
            <MyAssignments />
          </TabsContent>
          
          <TabsContent value="progress">
            <MyProgress />
          </TabsContent>
          
          <TabsContent value="planner">
            <StudyPlanner />
          </TabsContent>
          
          <TabsContent value="quizzes">
            <QuizGenerator />
          </TabsContent>
          
          <TabsContent value="forums">
            <DiscussionForums />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <LeaderboardView />
          </TabsContent>
          
          <TabsContent value="code-editor">
            <CodeEditor />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

interface StudentStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

const StudentStatCard = ({ title, value, subtitle, icon }: StudentStatCardProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
};

export default StudentDashboard;
