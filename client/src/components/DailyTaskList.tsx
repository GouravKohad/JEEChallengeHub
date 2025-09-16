import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, BookOpen, CheckCircle2, Circle, StickyNote } from "lucide-react";
import { DailyTask } from "@shared/schema";
import { format } from "date-fns";

interface DailyTaskListProps {
  tasks: DailyTask[];
  date: string;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onAddNote?: (taskId: string, note: string) => void;
}

export default function DailyTaskList({ tasks, date, onTaskToggle, onAddNote }: DailyTaskListProps) {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [noteTexts, setNoteTexts] = useState<Record<string, string>>({});

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTime = tasks.reduce((acc, task) => acc + task.timeAllotted, 0);
  const completedTime = tasks.filter(task => task.completed).reduce((acc, task) => acc + task.timeAllotted, 0);

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

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    console.log(`Task ${taskId} ${completed ? 'completed' : 'uncompleted'}`);
    onTaskToggle?.(taskId, completed);
  };

  const handleNoteToggle = (taskId: string) => {
    setExpandedNotes(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleNoteSave = (taskId: string) => {
    const note = noteTexts[taskId] || '';
    console.log(`Saving note for task ${taskId}:`, note);
    onAddNote?.(taskId, note);
    setExpandedNotes(prev => ({ ...prev, [taskId]: false }));
  };

  return (
    <Card data-testid="daily-task-list">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tasks for {format(new Date(date), 'MMMM dd, yyyy')}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              {completedTasks}/{tasks.length} completed
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {Math.round(completedTime / 60)}h/{Math.round(totalTime / 60)}h
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No tasks scheduled for this day</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <Card 
              key={task.id} 
              className={`hover-elevate transition-all ${
                task.completed ? 'bg-muted/30' : ''
              }`}
              data-testid={`task-card-${task.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                    className="mt-1"
                    data-testid={`checkbox-task-${task.id}`}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.topic}
                        </h4>
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-right">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{task.timeAllotted}min</span>
                        </div>
                        {task.completedAt && (
                          <span className="text-xs text-chart-1">✓ Completed</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getSubjectColor(task.subject)}>
                        {task.subject}
                      </Badge>
                      <Badge variant="outline">
                        {task.taskType.replace('-', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleNoteToggle(task.id)}
                        className="h-6 px-2 text-xs"
                        data-testid={`button-note-${task.id}`}
                      >
                        <StickyNote className="h-3 w-3 mr-1" />
                        {task.notes ? 'Edit Note' : 'Add Note'}
                      </Button>
                      {task.notes && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          "{task.notes}"
                        </span>
                      )}
                    </div>
                    
                    {expandedNotes[task.id] && (
                      <div className="space-y-2 pt-2 border-t">
                        <Textarea 
                          placeholder="Add your notes about this task..."
                          value={noteTexts[task.id] || task.notes || ''}
                          onChange={(e) => setNoteTexts(prev => ({ ...prev, [task.id]: e.target.value }))}
                          className="text-sm"
                          rows={3}
                          data-testid={`textarea-note-${task.id}`}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleNoteSave(task.id)}
                            data-testid={`button-save-note-${task.id}`}
                          >
                            Save Note
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleNoteToggle(task.id)}
                            data-testid={`button-cancel-note-${task.id}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}