import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useChallenges } from "@/contexts/ChallengeContext";
import DailyTaskList from "@/components/DailyTaskList";
import { format, addDays, subDays, startOfDay } from "date-fns";

export default function Tasks() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getTasksForDate, updateTask } = useChallenges();
  
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const tasksForDate = getTasksForDate(selectedDateString);

  const isToday = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();
  const isPast = selectedDate < startOfDay(new Date());
  const isFuture = selectedDate > startOfDay(new Date());

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddNote = async (taskId: string, note: string) => {
    try {
      await updateTask(taskId, { notes: note });
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6" data-testid="tasks-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Complete your scheduled study tasks and track progress
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={goToToday} 
          disabled={isToday}
          data-testid="button-go-to-today"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousDay}
              data-testid="button-previous-day"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <Calendar className="h-5 w-5" />
                {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2 justify-center mt-1">
                {isToday && (
                  <span className="text-xs bg-chart-1 text-white px-2 py-1 rounded-full">Today</span>
                )}
                {isPast && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Past</span>
                )}
                {isFuture && (
                  <span className="text-xs bg-chart-3 text-white px-2 py-1 rounded-full">Future</span>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextDay}
              data-testid="button-next-day"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1" data-testid="text-total-tasks">
                {tasksForDate.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1" data-testid="text-completed-tasks">
                {tasksForDate.filter(t => t.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2" data-testid="text-pending-tasks">
                {tasksForDate.filter(t => !t.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3" data-testid="text-total-time">
                {Math.round(tasksForDate.reduce((acc, t) => acc + t.timeAllotted, 0) / 60)}h
              </div>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Task List */}
      <DailyTaskList
        tasks={tasksForDate}
        date={selectedDateString}
        onTaskToggle={handleTaskToggle}
        onAddNote={handleAddNote}
      />
    </div>
  );
}