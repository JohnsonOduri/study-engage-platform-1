
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

  // Mock data for charts
  const activityData = [
    { name: "Mon", value: 2.4 },
    { name: "Tue", value: 1.3 },
    { name: "Wed", value: 3.2 },
    { name: "Thu", value: 5.2 },
    { name: "Fri", value: 3.5 },
    { name: "Sat", value: 2.3 },
    { name: "Sun", value: 1.5 },
  ];

  const courseProgressData = [
    { name: "Web Dev", value: 75 },
    { name: "Python", value: 45 },
    { name: "Database", value: 90 },
    { name: "UI/UX", value: 30 },
    { name: "Mobile App", value: 60 },
  ];

  const timeDistributionData = [
    { name: "Watching Videos", value: 35 },
    { name: "Reading Materials", value: 25 },
    { name: "Assignments", value: 20 },
    { name: "Quizzes", value: 15 },
    { name: "Forums", value: 5 },
  ];

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
              xAxisKey="name" 
              yAxisKey="value"
              strokeColor="#8b5cf6"
              gradientFrom="rgba(139, 92, 246, 0.2)"
              gradientTo="rgba(139, 92, 246, 0)"
              height={250}
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              tickFormatter={(value) => `${value}h`}
              tooltipFormatter={(value) => `${value} hours`}
              yAxisLabel="Hours"
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
              xAxisKey="name" 
              yAxisKey="value"
              color="#8b5cf6"
              height={250}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
              tooltipFormatter={(value) => `${value}%`}
              yAxisLabel="Completion"
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
                nameKey="name" 
                dataKey="value"
                colors={["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]}
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
