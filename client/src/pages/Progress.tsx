import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock, 
  BookOpen, 
  BarChart3,
  PieChart,
  TrendingDown,
  Award,
  Brain,
  Zap
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { useChallenges } from "@/contexts/ChallengeContext";
import { format, subDays, startOfDay, differenceInDays } from "date-fns";
import { JEE_SUBJECTS } from "@shared/schema";

export default function Progress() {
  const { state } = useChallenges();
  const { challenges, tasks } = state;
  const [timeRange, setTimeRange] = useState('30');

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const daysBack = parseInt(timeRange);
    const startDate = subDays(now, daysBack);

    // Filter data based on time range
    const filteredTasks = tasks.filter(task => 
      new Date(task.date) >= startDate
    );

    const completedTasks = filteredTasks.filter(task => task.completed);
    
    // Daily progress data
    const dailyProgress = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dayTasks = filteredTasks.filter(task => 
        startOfDay(new Date(task.date)).getTime() === startOfDay(date).getTime()
      );
      const dayCompleted = dayTasks.filter(task => task.completed);
      
      dailyProgress.push({
        date: format(date, 'MMM dd'),
        fullDate: format(date, 'yyyy-MM-dd'),
        tasksCompleted: dayCompleted.length,
        totalTasks: dayTasks.length,
        completionRate: dayTasks.length > 0 ? (dayCompleted.length / dayTasks.length) * 100 : 0,
        studyTime: dayCompleted.reduce((acc, task) => acc + (task.timeAllotted || 0), 0) / 60 // Convert to hours
      });
    }

    // Subject-wise performance
    const subjectPerformance = JEE_SUBJECTS.map(subject => {
      const subjectTasks = filteredTasks.filter(task => task.subject === subject);
      const subjectCompleted = subjectTasks.filter(task => task.completed);
      
      return {
        subject,
        totalTasks: subjectTasks.length,
        completedTasks: subjectCompleted.length,
        completionRate: subjectTasks.length > 0 ? (subjectCompleted.length / subjectTasks.length) * 100 : 0,
        timeSpent: subjectCompleted.reduce((acc, task) => acc + (task.timeAllotted || 0), 0) / 60
      };
    });

    // Task type distribution
    const taskTypes = ['theory', 'practice', 'revision', 'mock-test', 'dpp'];
    const taskTypeData = taskTypes.map(type => {
      const typeTasks = completedTasks.filter(task => task.taskType === type);
      return {
        type: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
        count: typeTasks.length,
        timeSpent: typeTasks.reduce((acc, task) => acc + (task.timeAllotted || 0), 0) / 60,
        fill: `hsl(var(--chart-${taskTypes.indexOf(type) + 1}))`
      };
    }).filter(item => item.count > 0);

    // Challenge performance
    const challengeStats = challenges.map(challenge => ({
      name: challenge.name,
      progress: (challenge.progress.completedDays / challenge.progress.totalDays) * 100,
      status: challenge.status,
      currentStreak: challenge.progress.currentStreak,
      longestStreak: challenge.progress.longestStreak,
      tasksCompleted: challenge.progress.completedTasks,
      totalTasks: challenge.progress.totalTasks
    }));

    return {
      dailyProgress,
      subjectPerformance,
      taskTypeData,
      challengeStats,
      overview: {
        totalTasks: filteredTasks.length,
        completedTasks: completedTasks.length,
        completionRate: filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0,
        totalStudyTime: completedTasks.reduce((acc, task) => acc + (task.timeAllotted || 0), 0) / 60,
        averageDaily: dailyProgress.length > 0 ? 
          dailyProgress.reduce((acc, day) => acc + day.studyTime, 0) / dailyProgress.length : 0,
        bestStreak: Math.max(...challenges.map(c => c.progress.longestStreak), 0),
        activeChallenges: challenges.filter(c => c.status === 'active').length
      }
    };
  }, [challenges, tasks, timeRange]);

  const subjectColors = {
    Physics: '#8b5cf6',
    Chemistry: '#06b6d4', 
    Mathematics: '#f59e0b'
  };

  const chartConfig = {
    tasksCompleted: {
      label: "Tasks Completed",
      color: "hsl(var(--chart-1))",
    },
    completionRate: {
      label: "Completion Rate %",
      color: "hsl(var(--chart-2))",
    },
    studyTime: {
      label: "Study Time (hrs)",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6" data-testid="progress-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Detailed analytics and insights into your JEE preparation journey
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate" data-testid="stat-total-tasks">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-completion-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.completionRate.toFixed(1)}%</div>
            <ProgressBar value={analytics.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-study-time">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalStudyTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.averageDaily.toFixed(1)}h avg/day
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-best-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Streak</CardTitle>
            <Zap className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.bestStreak}</div>
            <p className="text-xs text-muted-foreground">days consecutive</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily" data-testid="tab-daily">Daily Progress</TabsTrigger>
          <TabsTrigger value="subjects" data-testid="tab-subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="challenges" data-testid="tab-challenges">Challenge Stats</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Task Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daily Task Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={analytics.dailyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="tasksCompleted"
                      stroke="var(--color-tasksCompleted)"
                      fill="var(--color-tasksCompleted)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Study Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Time Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart data={analytics.dailyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="studyTime"
                      stroke="var(--color-studyTime)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Completion Rate Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Completion Rate Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart data={analytics.dailyProgress} height={300}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke="var(--color-completionRate)"
                    fill="var(--color-completionRate)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Performance Bars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.subjectPerformance.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.subject}</span>
                        <Badge variant="outline">
                          {subject.completionRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <ProgressBar value={subject.completionRate} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{subject.completedTasks}/{subject.totalTasks} tasks</span>
                        <span>{subject.timeSpent.toFixed(1)}h studied</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Task Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie 
                      data={analytics.taskTypeData} 
                      dataKey="count" 
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {analytics.taskTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </RechartsPieChart>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {analytics.taskTypeData.map((item, index) => (
                    <div key={item.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
                        />
                        <span>{item.type}</span>
                      </div>
                      <span className="font-medium">{item.count} tasks</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.challengeStats.map((challenge, index) => (
              <Card key={challenge.name} className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{challenge.name}</span>
                    <Badge 
                      variant={challenge.status === 'active' ? 'default' : 'secondary'}
                      data-testid={`badge-challenge-status-${index}`}
                    >
                      {challenge.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={challenge.progress} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Current Streak</div>
                      <div className="font-semibold">{challenge.currentStreak} days</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Best Streak</div>
                      <div className="font-semibold">{challenge.longestStreak} days</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Tasks Done</div>
                      <div className="font-semibold">{challenge.tasksCompleted}/{challenge.totalTasks}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Efficiency</div>
                      <div className="font-semibold">
                        {challenge.totalTasks > 0 ? 
                          ((challenge.tasksCompleted / challenge.totalTasks) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.overview.completionRate >= 80 && (
                  <div className="p-3 bg-chart-1/10 rounded-md border border-chart-1/20">
                    <div className="flex items-center gap-2 text-chart-1 font-medium">
                      <Award className="h-4 w-4" />
                      Excellent Performance!
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You're maintaining an {analytics.overview.completionRate.toFixed(0)}% completion rate. Keep up the great work!
                    </p>
                  </div>
                )}
                
                {analytics.overview.averageDaily < 2 && (
                  <div className="p-3 bg-chart-2/10 rounded-md border border-chart-2/20">
                    <div className="flex items-center gap-2 text-chart-2 font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Boost Your Study Time
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider increasing daily study time. Aim for at least 3-4 hours per day.
                    </p>
                  </div>
                )}

                {analytics.subjectPerformance.some(s => s.completionRate < 50) && (
                  <div className="p-3 bg-chart-3/10 rounded-md border border-chart-3/20">
                    <div className="flex items-center gap-2 text-chart-3 font-medium">
                      <Target className="h-4 w-4" />
                      Focus on Weak Areas
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Some subjects need attention. Consider creating focused challenges for improvement.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Study Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Best Performing Subject</h4>
                  {analytics.subjectPerformance.length > 0 && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{analytics.subjectPerformance.reduce((best, current) => 
                        current.completionRate > best.completionRate ? current : best
                      ).subject}</span>
                      <Badge variant="outline">
                        {analytics.subjectPerformance.reduce((best, current) => 
                          current.completionRate > best.completionRate ? current : best
                        ).completionRate.toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Areas for Improvement</h4>
                  {analytics.subjectPerformance
                    .filter(s => s.completionRate < 70)
                    .slice(0, 2)
                    .map(subject => (
                      <div key={subject.subject} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>{subject.subject}</span>
                        <Badge variant="outline">
                          {subject.completionRate.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-create-focused-challenge">
                    Create Focused Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}