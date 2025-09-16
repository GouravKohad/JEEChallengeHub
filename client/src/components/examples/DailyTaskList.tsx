import DailyTaskList from '../DailyTaskList';
import { DailyTask } from '@shared/schema';

export default function DailyTaskListExample() {
  // todo: remove mock functionality
  const mockTasks: DailyTask[] = [
    {
      id: 'task-1',
      challengeId: 'challenge-1',
      date: '2024-01-15',
      subject: 'Physics',
      topic: 'Kinematics',
      taskType: 'theory',
      description: 'Study motion in one dimension and related concepts',
      timeAllotted: 90,
      completed: true,
      completedAt: '2024-01-15T10:30:00Z',
      difficulty: 'medium',
      notes: 'Completed all exercises, need to review velocity-time graphs'
    },
    {
      id: 'task-2',
      challengeId: 'challenge-1',
      date: '2024-01-15',
      subject: 'Chemistry',
      topic: 'Atomic Structure',
      taskType: 'practice',
      description: 'Solve problems on electronic configuration',
      timeAllotted: 60,
      completed: false,
      difficulty: 'hard'
    },
    {
      id: 'task-3',
      challengeId: 'challenge-1',
      date: '2024-01-15',
      subject: 'Mathematics',
      topic: 'Trigonometry',
      taskType: 'dpp',
      description: 'Daily Practice Problems - Set 15',
      timeAllotted: 120,
      completed: true,
      completedAt: '2024-01-15T15:45:00Z',
      difficulty: 'easy',
      notes: 'All problems solved correctly'
    }
  ];

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    console.log(`Task ${taskId} toggled to ${completed}`);
  };

  const handleAddNote = (taskId: string, note: string) => {
    console.log(`Note added to task ${taskId}:`, note);
  };

  return (
    <DailyTaskList 
      tasks={mockTasks}
      date="2024-01-15"
      onTaskToggle={handleTaskToggle}
      onAddNote={handleAddNote}
    />
  );
}