import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Zap } from "lucide-react";

interface DashboardStatsProps {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  totalStudyHours: number;
  tasksCompleted: number;
}

export default function DashboardStats({ 
  totalChallenges, 
  activeChallenges, 
  completedChallenges, 
  currentStreak, 
  totalStudyHours, 
  tasksCompleted 
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Active Challenges",
      value: activeChallenges,
      total: totalChallenges,
      icon: Target,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10"
    },
    {
      title: "Completed Challenges",
      value: completedChallenges,
      total: totalChallenges,
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10"
    },
    {
      title: "Current Streak",
      value: currentStreak,
      suffix: "days",
      icon: Zap,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10"
    },
    {
      title: "Study Hours",
      value: totalStudyHours,
      suffix: "hrs",
      icon: Calendar,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dashboard-stats">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover-elevate" data-testid={`stat-card-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-value-${index}`}>
                {stat.value}
                {stat.suffix && <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>}
              </div>
              {stat.total && (
                <p className="text-xs text-muted-foreground">
                  of {stat.total} total
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}