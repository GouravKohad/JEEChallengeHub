import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, TrendingUp, Play, Pause, Download } from "lucide-react";
import { Challenge } from "@shared/schema";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { taskStorage } from "@/lib/localStorage";

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

  const handleExportPDF = () => {
    try {
      // Get all tasks for this challenge
      const allTasks = taskStorage.getAll();
      const challengeTasks = allTasks.filter(task => task.challengeId === challenge.id)
        .sort((a, b) => a.date.localeCompare(b.date));

      // Create new PDF document
      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(20);
      doc.text('JEE Challenge Report', 20, 20);
      
      // Challenge information
      doc.setFontSize(16);
      doc.text(challenge.name, 20, 35);
      
      doc.setFontSize(12);
      let yPos = 50;
      
      // Basic info
      const basicInfo = [
        `Start Date: ${format(new Date(challenge.startDate), 'MMM dd, yyyy')}`,
        `End Date: ${format(new Date(challenge.endDate), 'MMM dd, yyyy')}`,
        `Duration: ${challenge.duration} days`,
        `Daily Hours: ${challenge.dailyTimeHours} hours/day`,
        `Status: ${challenge.status.toUpperCase()}`,
        `Subjects: ${challenge.subjects.join(', ')}`,
        `Progress: ${challenge.progress.completedDays}/${challenge.progress.totalDays} days completed`,
        `Tasks: ${challenge.progress.completedTasks}/${challenge.progress.totalTasks} tasks completed`,
        `Current Streak: ${challenge.progress.currentStreak} days`,
        `Longest Streak: ${challenge.progress.longestStreak} days`
      ];
      
      basicInfo.forEach((info) => {
        doc.text(info, 20, yPos);
        yPos += 8;
      });
      
      // Topics by subject
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Topics Covered:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      Object.entries(challenge.topics).forEach(([subject, topics]) => {
        if (topics.length > 0) {
          doc.text(`${subject}:`, 25, yPos);
          yPos += 6;
          topics.forEach((topic) => {
            doc.text(`• ${topic}`, 30, yPos);
            yPos += 5;
          });
          yPos += 3;
        }
      });
      
      // Daily Tasks Table
      if (challengeTasks.length > 0) {
        yPos += 10;
        doc.setFontSize(14);
        doc.text('Daily Tasks Schedule:', 20, yPos);
        yPos += 10;
        
        const tableData = challengeTasks.map(task => [
          format(new Date(task.date), 'MMM dd'),
          task.subject,
          task.topic,
          task.taskType.replace('-', ' ').toUpperCase(),
          task.description,
          `${task.timeAllotted} min`,
          task.difficulty.toUpperCase(),
          task.completed ? 'Yes' : 'No'
        ]);
        
        autoTable(doc, {
          head: [['Date', 'Subject', 'Topic', 'Type', 'Description', 'Time', 'Difficulty', 'Completed']],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [71, 85, 105], // slate-600
            textColor: 255,
            fontSize: 9
          },
          columnStyles: {
            4: { cellWidth: 40 }, // Description column wider
          }
        });
      } else {
        yPos += 10;
        doc.setFontSize(12);
        doc.text('No daily tasks scheduled for this challenge yet.', 20, yPos);
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Generated on ${format(new Date(), 'PPP')} - Page ${i} of ${pageCount}`,
          20,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Save the PDF
      const fileName = `${challenge.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_challenge_report.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to export PDF. Please try again.');
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
            variant="outline" 
            size="sm" 
            onClick={handleExportPDF}
            data-testid={`button-export-pdf-${challenge.id}`}
            title="Export challenge details and tasks to PDF"
          >
            <Download className="h-4 w-4" />
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