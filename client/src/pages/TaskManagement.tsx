import { useState } from 'react';
import { useChallenges } from '@/contexts/ChallengeContext';
import { Challenge } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Table } from 'lucide-react';
import ChallengeTaskManager from '@/components/ChallengeTaskManager';

export default function TaskManagement() {
  const { state } = useChallenges();
  const { challenges, loading } = state;
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-task-management">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-1 text-white';
      case 'completed': return 'bg-chart-1 text-white';
      case 'paused': return 'bg-chart-2 text-white';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (selectedChallenge) {
    return (
      <div className="space-y-6" data-testid="task-management-detail">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedChallenge(null)}
            data-testid="button-back-to-challenges"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground mt-1">
              Excel-like interface to manage daily tasks
            </p>
          </div>
        </div>

        <ChallengeTaskManager challenge={selectedChallenge} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="task-management-page">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <p className="text-muted-foreground mt-1">
          Select a challenge to manage its daily tasks with Excel-like functionality
        </p>
      </div>

      {challenges.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Table className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Challenges Found</h3>
            <p className="text-muted-foreground mb-4">Create a challenge first to manage its tasks.</p>
            <Button asChild>
              <a href="/challenges">Go to Challenges</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="hover-elevate cursor-pointer" 
              onClick={() => setSelectedChallenge(challenge)}
              data-testid={`card-challenge-select-${challenge.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold" data-testid={`text-challenge-name-${challenge.id}`}>
                      {challenge.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {challenge.subjects.length} subjects • {challenge.duration} days
                    </div>
                  </div>
                  <Badge className={getStatusColor(challenge.status)} data-testid={`badge-status-${challenge.id}`}>
                    {challenge.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Progress</span>
                    <span>{challenge.progress.completedTasks}/{challenge.progress.totalTasks}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${challenge.progress.totalTasks > 0 
                          ? (challenge.progress.completedTasks / challenge.progress.totalTasks) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  {challenge.status === 'paused' && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Tasks are hidden from daily view while paused
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}