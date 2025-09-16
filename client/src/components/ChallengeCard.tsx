import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, TrendingUp, Play, Pause } from "lucide-react";
import { Challenge } from "@shared/schema";
import { format } from "date-fns";

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: (challengeId: string) => void;
  onPause?: (challengeId: string) => void;
  onResume?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onStart, onPause, onResume, onView }: ChallengeCardProps) {
  const progressPercentage = (challenge.progress.completedDays / challenge.progress.totalDays) * 100;
  const taskProgressPercentage = (challenge.progress.completedTasks / challenge.progress.totalTasks) * 100;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-1 text-white';
      case 'completed': return 'bg-chart-1 text-white';
      case 'paused': return 'bg-chart-2 text-white';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAction = () => {
    console.log(`Action triggered for challenge: ${challenge.id}, status: ${challenge.status}`);
    if (challenge.status === 'active' && onPause) {
      onPause(challenge.id);
    } else if (challenge.status === 'paused' && onResume) {
      onResume(challenge.id);
    } else if (challenge.status === 'archived' && onStart) {
      onStart(challenge.id);
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-challenge-${challenge.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold" data-testid={`text-challenge-name-${challenge.id}`}>
              {challenge.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(challenge.startDate), 'MMM dd')} - {format(new Date(challenge.endDate), 'MMM dd')}</span>
            </div>
          </div>
          <Badge className={getStatusColor(challenge.status)} data-testid={`badge-status-${challenge.id}`}>
            {challenge.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-chart-3" />
            <span>{challenge.dailyTimeHours}h/day</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-chart-1" />
            <span>{challenge.subjects.length} subjects</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{challenge.progress.completedDays}/{challenge.progress.totalDays} days</span>
          </div>
          <Progress value={progressPercentage} className="h-2" data-testid={`progress-days-${challenge.id}`} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tasks</span>
            <span>{challenge.progress.completedTasks}/{challenge.progress.totalTasks} completed</span>
          </div>
          <Progress value={taskProgressPercentage} className="h-2" data-testid={`progress-tasks-${challenge.id}`} />
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-chart-2" />
          <span>Current streak: {challenge.progress.currentStreak} days</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(challenge.id)}
            data-testid={`button-view-${challenge.id}`}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleAction}
            disabled={challenge.status === 'completed'}
            data-testid={`button-action-${challenge.id}`}
          >
            {challenge.status === 'active' && <Pause className="h-4 w-4 mr-1" />}
            {challenge.status === 'paused' && <Play className="h-4 w-4 mr-1" />}
            {challenge.status === 'archived' && <Play className="h-4 w-4 mr-1" />}
            {challenge.status === 'active' ? 'Pause' : 
             challenge.status === 'paused' ? 'Resume' : 
             challenge.status === 'completed' ? 'Completed' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}