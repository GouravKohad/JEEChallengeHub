import ChallengeCard from '../ChallengeCard';
import { Challenge } from '@shared/schema';

export default function ChallengeCardExample() {
  // todo: remove mock functionality
  const mockChallenge: Challenge = {
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
  };

  return (
    <ChallengeCard 
      challenge={mockChallenge} 
      onStart={(id) => console.log('Start challenge:', id)}
      onPause={(id) => console.log('Pause challenge:', id)}
      onResume={(id) => console.log('Resume challenge:', id)}
      onView={(id) => console.log('View challenge:', id)}
    />
  );
}