
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  BarChart, 
  PieChart 
} from "@/components/ui/recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, CheckCircle2, Clock, Calendar } from "lucide-react";

export const MyProgress = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = React.useState("weekly");

  // Mock data for charts - restructured to match the expected format
  const activityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Spent",
        data: [2.4, 1.3, 3.2, 5.2, 3.5, 2.3, 1.5],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        fill: true
      }
    ]
  };

  const courseProgressData = {
    labels: ["Web Dev", "Python", "Database", "UI/UX", "Mobile App"],
    datasets: [
      {
        label: "Completion",
        data: [75, 45, 90, 30, 60],
        backgroundColor: "#8b5cf6"
      }
    ]
  };

  const timeDistributionData = {
    labels: ["Watching Videos", "Reading Materials", "Assignments", "Quizzes", "Forums"],
    datasets: [
      {
        label: "Time Spent",
        data: [35, 25, 20, 15, 5],
        backgroundColor: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Progress</h2>
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProgressStatCard 
          title="XP Level" 
          value="Level 15" 
          detail="2,540 / 3,000 XP"
          progress={84}
          icon={<Trophy className="h-5 w-5 text-primary" />}
        />
        <ProgressStatCard 
          title="Badges Earned" 
          value="12 Badges" 
          detail="3 this month"
          progress={60}
          icon={<Award className="h-5 w-5 text-primary" />}
        />
        <ProgressStatCard 
          title="Completed Tasks" 
          value="75%" 
          detail="45/60 assignments"
          progress={75}
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={activityData}
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={courseProgressData}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <PieChart 
                data={timeDistributionData}
                height={250}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Perfect Attendance", desc: "Attended 7 classes in a row", xp: 150, date: "3 days ago" },
                { name: "Quiz Master", desc: "Scored 100% on 3 quizzes", xp: 200, date: "1 week ago" },
                { name: "Consistent Learner", desc: "Completed daily tasks for 5 days", xp: 100, date: "2 weeks ago" },
                { name: "Fast Learner", desc: "Completed a course 2 weeks ahead of schedule", xp: 300, date: "3 weeks ago" },
              ].map((badge, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{badge.name}</h4>
                      <Badge variant="outline" className="text-xs">+{badge.xp} XP</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{badge.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {badge.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ProgressStatCardProps {
  title: string;
  value: string;
  detail: string;
  progress: number;
  icon: React.ReactNode;
}

const ProgressStatCard = ({ title, value, detail, progress, icon }: ProgressStatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mb-2">{detail}</p>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};
