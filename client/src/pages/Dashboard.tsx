import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Calendar, Target } from "lucide-react";
import { useChallenges } from "@/contexts/ChallengeContext";
import DashboardStats from "@/components/DashboardStats";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeCreationModal from "@/components/ChallengeCreationModal";
import StreakCounter from "@/components/StreakCounter";
import { InsertChallenge } from "@shared/schema";

export default function Dashboard() {
  const { state, createChallenge, updateChallenge, getChallengeStats } = useChallenges();
  const { challenges, loading } = state;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-dashboard">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const stats = getChallengeStats();

  const handleCreateChallenge = async (newChallenge: InsertChallenge) => {
    try {
      await createChallenge(newChallenge);
    } catch (error) {
      console.error('Failed to create challenge:', error);
    }
  };

  const handleChallengeAction = async (challengeId: string, action: string) => {
    try {
      const updates: any = {};
      if (action === 'pause') updates.status = 'paused';
      if (action === 'resume' || action === 'start') updates.status = 'active';
      
      await updateChallenge(challengeId, updates);
    } catch (error) {
      console.error(`Failed to ${action} challenge:`, error);
    }
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
        totalChallenges={stats.total}
        activeChallenges={stats.active}
        completedChallenges={stats.completed}
        currentStreak={stats.currentStreak}
        totalStudyHours={stats.totalStudyHours}
        tasksCompleted={stats.totalTasksCompleted}
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
            currentStreak={stats.currentStreak}
            longestStreak={Math.max(0, ...challenges.map(c => c.progress.longestStreak))}
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