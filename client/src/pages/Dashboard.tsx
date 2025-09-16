import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Calendar, Target } from "lucide-react";
import DashboardStats from "@/components/DashboardStats";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeCreationModal from "@/components/ChallengeCreationModal";
import StreakCounter from "@/components/StreakCounter";
import { Challenge, InsertChallenge } from "@shared/schema";

export default function Dashboard() {
  // todo: remove mock functionality
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'challenge-1',
      type: 'revision',
      name: '15 Days Physics Revision Challenge',
      duration: 15,
      subjects: ['Physics'],
      topics: { Physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'] },
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      dailyTimeHours: 4,
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      progress: {
        completedDays: 8,
        totalDays: 15,
        completedTasks: 24,
        totalTasks: 45,
        currentStreak: 5,
        longestStreak: 7
      }
    },
    {
      id: 'challenge-2',
      type: 'dpp',
      name: '30 Days Math DPP Challenge',
      duration: 30,
      subjects: ['Mathematics'],
      topics: { Mathematics: ['Calculus', 'Algebra', 'Trigonometry'] },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dailyTimeHours: 3,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      progress: {
        completedDays: 18,
        totalDays: 30,
        completedTasks: 54,
        totalTasks: 90,
        currentStreak: 12,
        longestStreak: 15
      }
    },
    {
      id: 'challenge-3',
      type: 'backlog',
      name: 'Chemistry Backlog Clearance',
      duration: 20,
      subjects: ['Chemistry'],
      topics: { Chemistry: ['Organic Chemistry', 'Physical Chemistry'] },
      startDate: '2023-12-15',
      endDate: '2024-01-04',
      dailyTimeHours: 5,
      status: 'completed',
      createdAt: '2023-12-15T00:00:00Z',
      progress: {
        completedDays: 20,
        totalDays: 20,
        completedTasks: 60,
        totalTasks: 60,
        currentStreak: 0,
        longestStreak: 20
      }
    }
  ]);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const currentStreak = Math.max(...challenges.map(c => c.progress.currentStreak));
  const totalStudyHours = challenges.reduce((acc, c) => 
    acc + (c.progress.completedDays * c.dailyTimeHours), 0
  );
  const totalTasksCompleted = challenges.reduce((acc, c) => 
    acc + c.progress.completedTasks, 0
  );

  const handleCreateChallenge = (newChallenge: InsertChallenge) => {
    console.log('Creating new challenge:', newChallenge);
    const challenge: Challenge = {
      ...newChallenge,
      id: `challenge-${Date.now()}`,
      createdAt: new Date().toISOString(),
      progress: {
        completedDays: 0,
        totalDays: newChallenge.duration,
        completedTasks: 0,
        totalTasks: newChallenge.duration * 3, // Estimated 3 tasks per day
        currentStreak: 0,
        longestStreak: 0
      }
    };
    setChallenges(prev => [challenge, ...prev]);
  };

  const handleChallengeAction = (challengeId: string, action: string) => {
    console.log(`${action} challenge:`, challengeId);
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        if (action === 'pause') return { ...c, status: 'paused' as const };
        if (action === 'resume' || action === 'start') return { ...c, status: 'active' as const };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your JEE preparation progress and manage challenges
          </p>
        </div>
        <ChallengeCreationModal onCreateChallenge={handleCreateChallenge}>
          <Button data-testid="button-create-challenge-header">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </ChallengeCreationModal>
      </div>

      {/* Stats Overview */}
      <DashboardStats
        totalChallenges={challenges.length}
        activeChallenges={activeChallenges.length}
        completedChallenges={completedChallenges.length}
        currentStreak={currentStreak}
        totalStudyHours={totalStudyHours}
        tasksCompleted={totalTasksCompleted}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenges Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-1" />
                <h2 className="text-xl font-semibold">Active Challenges</h2>
                <span className="text-sm text-muted-foreground">({activeChallenges.length})</span>
              </div>
              <div className="grid gap-4">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onStart={(id) => handleChallengeAction(id, 'start')}
                    onPause={(id) => handleChallengeAction(id, 'pause')}
                    onResume={(id) => handleChallengeAction(id, 'resume')}
                    onView={(id) => console.log('View challenge:', id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Challenges */}
          {completedChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-chart-1" />
                <h2 className="text-xl font-semibold">Recent Challenges</h2>
              </div>
              <div className="grid gap-4">
                {completedChallenges.slice(0, 2).map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onView={(id) => console.log('View challenge:', id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {challenges.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Challenges Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first JEE challenge to start your structured preparation journey.
                </p>
                <ChallengeCreationModal onCreateChallenge={handleCreateChallenge} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Streak Counter */}
          <StreakCounter
            currentStreak={currentStreak}
            longestStreak={Math.max(...challenges.map(c => c.progress.longestStreak))}
            totalDays={challenges.reduce((acc, c) => acc + c.progress.completedDays, 0)}
            studiedToday={activeChallenges.some(c => c.progress.currentStreak > 0)}
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-tasks">
                <Calendar className="h-4 w-4 mr-2" />
                View Today's Tasks
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-progress">
                <Target className="h-4 w-4 mr-2" />
                Check Progress
              </Button>
              <ChallengeCreationModal onCreateChallenge={handleCreateChallenge}>
                <Button variant="outline" className="w-full justify-start" data-testid="button-new-challenge">
                  <Plus className="h-4 w-4 mr-2" />
                  New Challenge
                </Button>
              </ChallengeCreationModal>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}