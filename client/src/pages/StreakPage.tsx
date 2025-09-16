import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  Target, 
  Trophy,
  Flame,
  Award,
  Star,
  CheckCircle,
  Circle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sprout,
  Gem,
  Crown
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { useChallenges } from "@/contexts/ChallengeContext";
import { format, subDays, startOfDay, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";

export default function StreakPage() {
  const { state } = useChallenges();
  const { challenges, tasks } = state;
  const [selectedRange, setSelectedRange] = useState('30');

  // Calculate streak analytics
  const streakAnalytics = useMemo(() => {
    const now = new Date();
    const daysBack = parseInt(selectedRange);
    
    // Get all completed tasks
    const completedTasks = tasks.filter(task => task.completed);
    
    // Calculate daily completion status for the range
    const dailyStatus = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dayTasks = tasks.filter(task => 
        startOfDay(new Date(task.date)).getTime() === startOfDay(date).getTime()
      );
      const dayCompleted = dayTasks.filter(task => task.completed);
      
      dailyStatus.push({
        date: format(date, 'MMM dd'),
        fullDate: format(date, 'yyyy-MM-dd'),
        hasTask: dayTasks.length > 0,
        completed: dayCompleted.length > 0,
        completionRate: dayTasks.length > 0 ? (dayCompleted.length / dayTasks.length) * 100 : 0,
        tasksCompleted: dayCompleted.length,
        totalTasks: dayTasks.length,
        studyTime: dayCompleted.reduce((acc, task) => acc + (task.timeAllotted || 0), 0) / 60
      });
    }

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakEndDate: Date | null = null;
    
    // Calculate streaks from most recent backwards
    for (let i = dailyStatus.length - 1; i >= 0; i--) {
      const day = dailyStatus[i];
      if (day.completed && day.hasTask) {
        tempStreak++;
        if (i === dailyStatus.length - 1) { // Today or most recent day
          currentStreak = tempStreak;
        }
      } else if (day.hasTask) {
        // If we haven't set currentStreak yet and we have a temp streak, set it
        if (i === dailyStatus.length - 1 && tempStreak > 0) {
          currentStreak = tempStreak;
        }
        if (streakEndDate === null && tempStreak > 0) {
          streakEndDate = new Date(day.fullDate);
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      } else {
        // No task day - continue streak if we're building one
        if (i === dailyStatus.length - 1 && tempStreak > 0) {
          currentStreak = tempStreak;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate challenge streaks
    const challengeStreaks = challenges.map(challenge => ({
      name: challenge.name,
      currentStreak: challenge.progress.currentStreak,
      longestStreak: challenge.progress.longestStreak,
      status: challenge.status
    }));

    // Today's status
    const today = dailyStatus[dailyStatus.length - 1] || { completed: false, hasTask: false };
    const yesterday = dailyStatus[dailyStatus.length - 2] || { completed: false, hasTask: false };

    // Streak milestones
    const milestones = [
      { days: 3, title: "Getting Started", icon: "Sprout", achieved: longestStreak >= 3 },
      { days: 7, title: "Week Warrior", icon: "Star", achieved: longestStreak >= 7 },
      { days: 14, title: "Fortnight Fighter", icon: "Flame", achieved: longestStreak >= 14 },
      { days: 30, title: "Monthly Master", icon: "Trophy", achieved: longestStreak >= 30 },
      { days: 50, title: "Persistence Pro", icon: "Gem", achieved: longestStreak >= 50 },
      { days: 100, title: "Century Champion", icon: "Crown", achieved: longestStreak >= 100 }
    ];

    // Next milestone
    const nextMilestone = milestones.find(m => !m.achieved);
    const progressToNext = nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100;

    return {
      currentStreak,
      longestStreak,
      dailyStatus,
      challengeStreaks,
      todayCompleted: today.completed,
      todayHasTask: today.hasTask,
      yesterdayCompleted: yesterday.completed,
      streakEndDate,
      milestones,
      nextMilestone,
      progressToNext,
      totalStudyDays: dailyStatus.filter(d => d.completed).length,
      averageDaily: dailyStatus.length > 0 ? 
        dailyStatus.reduce((acc, day) => acc + day.studyTime, 0) / dailyStatus.length : 0
    };
  }, [challenges, tasks, selectedRange]);

  const chartConfig = {
    completed: {
      label: "Study Days",
      color: "hsl(var(--chart-2))",
    },
    completionRate: {
      label: "Completion Rate %",
      color: "hsl(var(--chart-2))",
    },
    studyTime: {
      label: "Study Time (hrs)",
      color: "hsl(var(--chart-1))",
    },
  };

  const getStreakMessage = () => {
    if (streakAnalytics.todayCompleted) {
      return {
        type: "success",
        message: "Great job! You've studied today and maintained your streak!",
        icon: <CheckCircle className="h-4 w-4" />
      };
    } else if (streakAnalytics.todayHasTask && !streakAnalytics.todayCompleted) {
      if (streakAnalytics.currentStreak > 0) {
        return {
          type: "warning",
          message: `Don't break your ${streakAnalytics.currentStreak}-day streak! Complete today's tasks.`,
          icon: <Circle className="h-4 w-4" />
        };
      } else {
        return {
          type: "info",
          message: "Start a new streak by completing today's tasks!",
          icon: <Circle className="h-4 w-4" />
        };
      }
    } else {
      return {
        type: "neutral",
        message: "No tasks scheduled for today. Create a challenge to get started!",
        icon: <Target className="h-4 w-4" />
      };
    }
  };

  const streakMessage = getStreakMessage();

  // Helper function to render milestone icons
  const renderMilestoneIcon = (iconName: string, className: string = "h-5 w-5") => {
    const iconMap = {
      Sprout: <Sprout className={className} />,
      Star: <Star className={className} />,
      Flame: <Flame className={className} />,
      Trophy: <Trophy className={className} />,
      Gem: <Gem className={className} />,
      Crown: <Crown className={className} />
    };
    return iconMap[iconName as keyof typeof iconMap] || <Star className={className} />;
  };

  return (
    <div className="space-y-6" data-testid="streak-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Streak Counter</h1>
          <p className="text-muted-foreground mt-1">
            Track your study consistency and build lasting habits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRange('7')}
            className={selectedRange === '7' ? 'bg-primary text-primary-foreground' : ''}
            data-testid="button-range-7"
          >
            7D
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRange('30')}
            className={selectedRange === '30' ? 'bg-primary text-primary-foreground' : ''}
            data-testid="button-range-30"
          >
            30D
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRange('90')}
            className={selectedRange === '90' ? 'bg-primary text-primary-foreground' : ''}
            data-testid="button-range-90"
          >
            90D
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className={`p-4 rounded-lg border ${
        streakMessage.type === 'success' ? 'bg-chart-1/10 border-chart-1/20' :
        streakMessage.type === 'warning' ? 'bg-chart-2/10 border-chart-2/20' :
        streakMessage.type === 'info' ? 'bg-chart-3/10 border-chart-3/20' :
        'bg-muted border-border'
      }`} data-testid="streak-message">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${
            streakMessage.type === 'success' ? 'bg-chart-1/20' :
            streakMessage.type === 'warning' ? 'bg-chart-2/20' :
            streakMessage.type === 'info' ? 'bg-chart-3/20' :
            'bg-muted'
          }`}>
            {streakMessage.icon}
          </div>
          <div>
            <p className="font-medium">{streakMessage.message}</p>
            {streakMessage.type === 'warning' && (
              <p className="text-sm text-muted-foreground mt-1">
                Complete your tasks before midnight to keep the streak alive!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate" data-testid="stat-current-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-3xl font-bold text-chart-2"
              animate={{ scale: streakAnalytics.todayCompleted ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {streakAnalytics.currentStreak}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              {streakAnalytics.currentStreak === 1 ? 'day' : 'days'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-longest-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
            <Trophy className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streakAnalytics.longestStreak}</div>
            <p className="text-xs text-muted-foreground">personal best</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-study-days">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Days</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streakAnalytics.totalStudyDays}</div>
            <p className="text-xs text-muted-foreground">in {selectedRange} days</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="stat-consistency">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consistency</CardTitle>
            <Target className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((streakAnalytics.totalStudyDays / parseInt(selectedRange)) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">of days studied</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones" data-testid="tab-milestones">Milestones</TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">Calendar</TabsTrigger>
          <TabsTrigger value="challenges" data-testid="tab-challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Streak Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Study Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={streakAnalytics.dailyStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
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

            {/* Next Milestone Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {streakAnalytics.nextMilestone ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          {renderMilestoneIcon(streakAnalytics.nextMilestone.icon, "h-6 w-6 text-primary")}
                        </div>
                        <div>
                          <h3 className="font-semibold">{streakAnalytics.nextMilestone.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {streakAnalytics.nextMilestone.days} days
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {Math.round(streakAnalytics.progressToNext)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{streakAnalytics.currentStreak} days</span>
                        <span>{streakAnalytics.nextMilestone.days} days</span>
                      </div>
                      <Progress value={streakAnalytics.progressToNext} />
                      <p className="text-xs text-center text-muted-foreground">
                        {streakAnalytics.nextMilestone.days - streakAnalytics.currentStreak} more days to go!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Crown className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <h3 className="font-semibold">Streak Master!</h3>
                    <p className="text-sm text-muted-foreground">
                      You've achieved all available milestones. Keep going!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recovery Tips */}
          {streakAnalytics.currentStreak === 0 && streakAnalytics.longestStreak > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Streak Recovery Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Start Small</h4>
                    <p className="text-sm text-muted-foreground">
                      Begin with just 15-30 minutes of study to rebuild the habit.
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Set Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Use phone alarms or study apps to remind you to study daily.
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Choose Easy Topics</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with revision or topics you enjoy to build momentum.
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Track Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Check this page daily to visualize your growing streak.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streakAnalytics.milestones.map((milestone, index) => (
              <Card 
                key={milestone.days} 
                className={`hover-elevate ${milestone.achieved ? 'bg-chart-1/5 border-chart-1/20' : ''}`}
                data-testid={`milestone-${milestone.days}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{milestone.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{milestone.days} days</p>
                      </div>
                    </div>
                    {milestone.achieved && (
                      <CheckCircle className="h-5 w-5 text-chart-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {milestone.achieved ? (
                    <Badge className="bg-chart-1 text-white">Achieved!</Badge>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.min(streakAnalytics.longestStreak, milestone.days)}/{milestone.days}</span>
                      </div>
                      <Progress 
                        value={(Math.min(streakAnalytics.longestStreak, milestone.days) / milestone.days) * 100} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Study Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {streakAnalytics.dailyStatus.slice(-28).map((day, index) => (
                  <div
                    key={day.fullDate}
                    className={`p-2 rounded-md text-xs ${
                      day.completed 
                        ? 'bg-chart-1 text-white' 
                        : day.hasTask 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-background'
                    }`}
                    title={`${day.fullDate}: ${day.completed ? 'Studied' : day.hasTask ? 'Missed' : 'No tasks'}`}
                    data-testid={`calendar-day-${index}`}
                  >
                    {format(new Date(day.fullDate), 'd')}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded"></div>
                  <span>Studied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-background border rounded"></div>
                  <span>No tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {streakAnalytics.challengeStreaks.map((challenge, index) => (
              <Card key={challenge.name} className="hover-elevate" data-testid={`challenge-streak-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{challenge.name}</span>
                    <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                      {challenge.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-chart-2">{challenge.currentStreak}</div>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{challenge.longestStreak}</div>
                      <p className="text-xs text-muted-foreground">Best</p>
                    </div>
                  </div>
                  
                  {challenge.currentStreak === challenge.longestStreak && challenge.currentStreak > 0 && (
                    <div className="text-center p-2 bg-chart-1/10 rounded-md">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-4 w-4 text-chart-1" />
                        <p className="text-sm font-medium text-chart-1">Personal Best!</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}