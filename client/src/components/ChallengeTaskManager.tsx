import { useState } from 'react';
import { Challenge, DailyTask } from '@shared/schema';
import { useChallenges } from '@/contexts/ChallengeContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface ChallengeTaskManagerProps {
  challenge: Challenge;
}

interface EditingTask {
  id?: string;
  date: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  taskType: 'theory' | 'practice' | 'revision' | 'mock-test' | 'dpp' | 'concept-mastery' | 'intensive-practice' | 'exam-simulation' | 'formula-practice' | 'previous-year' | 'speed-drill' | 'video-lecture' | 'concept-mapping';
  description: string;
  timeAllotted: number;
  difficulty: 'easy' | 'medium' | 'hard';
  notes: string;
}

export default function ChallengeTaskManager({ challenge }: ChallengeTaskManagerProps) {
  const { getTasksForChallenge, addTask, updateTask, deleteTask } = useChallenges();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingData, setEditingData] = useState<EditingTask>({
    date: format(new Date(), 'yyyy-MM-dd'),
    subject: 'Mathematics',
    topic: '',
    taskType: 'theory',
    description: '',
    timeAllotted: 60,
    difficulty: 'medium',
    notes: ''
  });

  // Get all tasks for this challenge (including paused)
  const allChallengeTasks = getTasksForChallenge(challenge.id).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'bg-chart-3 text-white';
      case 'Chemistry': return 'bg-chart-1 text-white';
      case 'Mathematics': return 'bg-chart-2 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-chart-1 text-white';
      case 'medium': return 'bg-chart-2 text-white';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStartEdit = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditingData({
      date: task.date,
      subject: task.subject,
      topic: task.topic,
      taskType: task.taskType,
      description: task.description,
      timeAllotted: task.timeAllotted,
      difficulty: task.difficulty,
      notes: task.notes || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTaskId) return;
    
    try {
      await updateTask(editingTaskId, {
        date: editingData.date,
        subject: editingData.subject,
        topic: editingData.topic,
        taskType: editingData.taskType,
        description: editingData.description,
        timeAllotted: editingData.timeAllotted,
        difficulty: editingData.difficulty,
        notes: editingData.notes
      });
      setEditingTaskId(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingData({
      date: format(new Date(), 'yyyy-MM-dd'),
      subject: 'Mathematics',
      topic: '',
      taskType: 'theory',
      description: '',
      timeAllotted: 60,
      difficulty: 'medium',
      notes: ''
    });
  };

  const handleAddTask = async () => {
    try {
      await addTask({
        challengeId: challenge.id,
        date: editingData.date,
        subject: editingData.subject,
        topic: editingData.topic,
        taskType: editingData.taskType,
        description: editingData.description,
        timeAllotted: editingData.timeAllotted,
        difficulty: editingData.difficulty,
        notes: editingData.notes,
        completed: false
      });
      setIsAddingTask(false);
      setEditingData({
        date: format(new Date(), 'yyyy-MM-dd'),
        subject: 'Mathematics',
        topic: '',
        taskType: 'theory',
        description: '',
        timeAllotted: 60,
        difficulty: 'medium',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const TaskRow = ({ task, isEditing }: { task: DailyTask; isEditing: boolean }) => {
    if (isEditing) {
      return (
        <tr className="border-b">
          <td className="p-2">
            <Input
              type="date"
              value={editingData.date}
              onChange={(e) => setEditingData({...editingData, date: e.target.value})}
              data-testid={`input-edit-date-${task.id}`}
            />
          </td>
          <td className="p-2">
            <Select value={editingData.subject} onValueChange={(value: any) => setEditingData({...editingData, subject: value})}>
              <SelectTrigger data-testid={`select-edit-subject-${task.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </td>
          <td className="p-2">
            <Input
              value={editingData.topic}
              onChange={(e) => setEditingData({...editingData, topic: e.target.value})}
              placeholder="Topic"
              data-testid={`input-edit-topic-${task.id}`}
            />
          </td>
          <td className="p-2">
            <Select value={editingData.taskType} onValueChange={(value: any) => setEditingData({...editingData, taskType: value})}>
              <SelectTrigger data-testid={`select-edit-tasktype-${task.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theory">Theory</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="revision">Revision</SelectItem>
                <SelectItem value="mock-test">Mock Test</SelectItem>
                <SelectItem value="dpp">DPP</SelectItem>
                <SelectItem value="concept-mastery">Concept Mastery</SelectItem>
                <SelectItem value="intensive-practice">Intensive Practice</SelectItem>
                <SelectItem value="exam-simulation">Exam Simulation</SelectItem>
                <SelectItem value="formula-practice">Formula Practice</SelectItem>
                <SelectItem value="previous-year">Previous Year</SelectItem>
                <SelectItem value="speed-drill">Speed Drill</SelectItem>
                <SelectItem value="video-lecture">Video Lecture</SelectItem>
                <SelectItem value="concept-mapping">Concept Mapping</SelectItem>
              </SelectContent>
            </Select>
          </td>
          <td className="p-2">
            <Textarea
              value={editingData.description}
              onChange={(e) => setEditingData({...editingData, description: e.target.value})}
              placeholder="Description"
              className="min-h-12"
              data-testid={`textarea-edit-description-${task.id}`}
            />
          </td>
          <td className="p-2">
            <Input
              type="number"
              value={editingData.timeAllotted}
              onChange={(e) => setEditingData({...editingData, timeAllotted: parseInt(e.target.value) || 0})}
              min="1"
              data-testid={`input-edit-time-${task.id}`}
            />
          </td>
          <td className="p-2">
            <Select value={editingData.difficulty} onValueChange={(value: any) => setEditingData({...editingData, difficulty: value})}>
              <SelectTrigger data-testid={`select-edit-difficulty-${task.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </td>
          <td className="p-2">
            <Textarea
              value={editingData.notes}
              onChange={(e) => setEditingData({...editingData, notes: e.target.value})}
              placeholder="Notes"
              className="min-h-12"
              data-testid={`textarea-edit-notes-${task.id}`}
            />
          </td>
          <td className="p-2">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                data-testid={`button-save-edit-${task.id}`}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancelEdit}
                data-testid={`button-cancel-edit-${task.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="border-b hover-elevate">
        <td className="p-2" data-testid={`text-task-date-${task.id}`}>
          {format(new Date(task.date), 'MMM dd, yyyy')}
        </td>
        <td className="p-2">
          <Badge className={getSubjectColor(task.subject)} data-testid={`badge-task-subject-${task.id}`}>
            {task.subject}
          </Badge>
        </td>
        <td className="p-2" data-testid={`text-task-topic-${task.id}`}>{task.topic}</td>
        <td className="p-2" data-testid={`text-task-type-${task.id}`}>{task.taskType}</td>
        <td className="p-2 max-w-xs truncate" data-testid={`text-task-description-${task.id}`}>{task.description}</td>
        <td className="p-2" data-testid={`text-task-time-${task.id}`}>{task.timeAllotted}min</td>
        <td className="p-2">
          <Badge className={getDifficultyColor(task.difficulty)} data-testid={`badge-task-difficulty-${task.id}`}>
            {task.difficulty}
          </Badge>
        </td>
        <td className="p-2 max-w-xs truncate" data-testid={`text-task-notes-${task.id}`}>{task.notes || '-'}</td>
        <td className="p-2">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStartEdit(task)}
              data-testid={`button-edit-task-${task.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => handleDeleteTask(task.id)}
              data-testid={`button-delete-task-${task.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const AddTaskRow = () => {
    if (!isAddingTask) return null;

    return (
      <tr className="border-b bg-muted/20">
        <td className="p-2">
          <Input
            type="date"
            value={editingData.date}
            onChange={(e) => setEditingData({...editingData, date: e.target.value})}
            data-testid="input-add-date"
          />
        </td>
        <td className="p-2">
          <Select value={editingData.subject} onValueChange={(value: any) => setEditingData({...editingData, subject: value})}>
            <SelectTrigger data-testid="select-add-subject">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Input
            value={editingData.topic}
            onChange={(e) => setEditingData({...editingData, topic: e.target.value})}
            placeholder="Topic"
            data-testid="input-add-topic"
          />
        </td>
        <td className="p-2">
          <Select value={editingData.taskType} onValueChange={(value: any) => setEditingData({...editingData, taskType: value})}>
            <SelectTrigger data-testid="select-add-tasktype">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="revision">Revision</SelectItem>
              <SelectItem value="mock-test">Mock Test</SelectItem>
              <SelectItem value="dpp">DPP</SelectItem>
              <SelectItem value="concept-mastery">Concept Mastery</SelectItem>
              <SelectItem value="intensive-practice">Intensive Practice</SelectItem>
              <SelectItem value="exam-simulation">Exam Simulation</SelectItem>
              <SelectItem value="formula-practice">Formula Practice</SelectItem>
              <SelectItem value="previous-year">Previous Year</SelectItem>
              <SelectItem value="speed-drill">Speed Drill</SelectItem>
              <SelectItem value="video-lecture">Video Lecture</SelectItem>
              <SelectItem value="concept-mapping">Concept Mapping</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Textarea
            value={editingData.description}
            onChange={(e) => setEditingData({...editingData, description: e.target.value})}
            placeholder="Description"
            className="min-h-12"
            data-testid="textarea-add-description"
          />
        </td>
        <td className="p-2">
          <Input
            type="number"
            value={editingData.timeAllotted}
            onChange={(e) => setEditingData({...editingData, timeAllotted: parseInt(e.target.value) || 0})}
            min="1"
            data-testid="input-add-time"
          />
        </td>
        <td className="p-2">
          <Select value={editingData.difficulty} onValueChange={(value: any) => setEditingData({...editingData, difficulty: value})}>
            <SelectTrigger data-testid="select-add-difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="p-2">
          <Textarea
            value={editingData.notes}
            onChange={(e) => setEditingData({...editingData, notes: e.target.value})}
            placeholder="Notes"
            className="min-h-12"
            data-testid="textarea-add-notes"
          />
        </td>
        <td className="p-2">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAddTask}
              data-testid="button-save-add"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsAddingTask(false);
                setEditingData({
                  date: format(new Date(), 'yyyy-MM-dd'),
                  subject: 'Mathematics',
                  topic: '',
                  taskType: 'theory',
                  description: '',
                  timeAllotted: 60,
                  difficulty: 'medium',
                  notes: ''
                });
              }}
              data-testid="button-cancel-add"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card data-testid={`task-manager-${challenge.id}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Task Manager - {challenge.name}
            <Badge className={challenge.status === 'paused' ? 'bg-chart-2 text-white' : 'bg-chart-1 text-white'}>
              {challenge.status}
            </Badge>
          </CardTitle>
          <Button 
            onClick={() => setIsAddingTask(true)}
            disabled={isAddingTask}
            data-testid="button-add-task"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage all daily tasks for this challenge. {challenge.status === 'paused' ? 'These tasks are hidden from daily view while the challenge is paused.' : ''}
        </p>
      </CardHeader>
      
      <CardContent>
        {allChallengeTasks.length === 0 && !isAddingTask ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks found for this challenge.</p>
            <Button onClick={() => setIsAddingTask(true)} data-testid="button-add-first-task">
              <Plus className="h-4 w-4 mr-2" />
              Add First Task
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="tasks-table">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Topic</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Time (min)</th>
                  <th className="text-left p-2">Difficulty</th>
                  <th className="text-left p-2">Notes</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AddTaskRow />
                {allChallengeTasks.map(task => (
                  <TaskRow 
                    key={task.id} 
                    task={task} 
                    isEditing={editingTaskId === task.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}