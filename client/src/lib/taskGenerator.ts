import { Challenge, DailyTask, JEE_TOPICS } from "@shared/schema";
import { addDays, format, differenceInDays } from "date-fns";

interface TaskTemplate {
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  taskType: 'theory' | 'practice' | 'revision' | 'mock-test' | 'dpp' | 'concept-mastery' | 'intensive-practice' | 'exam-simulation' | 'formula-practice' | 'previous-year' | 'speed-drill' | 'video-lecture' | 'concept-mapping';
  description: string;
  timeAllotted: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

// Task generation based on challenge type and topics
const generateTasksForTopic = (
  challengeType: string,
  subject: 'Physics' | 'Chemistry' | 'Mathematics',
  topic: string,
  dailyTimeHours: number
): TaskTemplate[] => {
  const tasks: TaskTemplate[] = [];
  const totalDailyMinutes = dailyTimeHours * 60;

  switch (challengeType) {
    case 'revision':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'theory',
          description: `Review ${topic} concepts and formulas`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.4),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'practice',
          description: `Solve practice problems on ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.6),
          difficulty: 'medium'
        }
      );
      break;

    case 'dpp':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'dpp',
          description: `Daily Practice Problems - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.8),
          difficulty: 'hard'
        },
        {
          subject,
          topic,
          taskType: 'revision',
          description: `Quick revision of ${topic} mistakes`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.2),
          difficulty: 'easy'
        }
      );
      break;

    case 'backlog':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'theory',
          description: `Complete ${topic} chapter from scratch`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.5),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'practice',
          description: `Solve all ${topic} exercises`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.5),
          difficulty: 'hard'
        }
      );
      break;

    case 'mock':
      if (Math.random() > 0.7) { // 30% chance for mock test day
        tasks.push({
          subject,
          topic,
          taskType: 'mock-test',
          description: `Full length mock test - ${subject}`,
          timeAllotted: totalDailyMinutes,
          difficulty: 'hard'
        });
      } else {
        tasks.push(
          {
            subject,
            topic,
            taskType: 'revision',
            description: `Strategic revision of ${topic}`,
            timeAllotted: Math.floor(totalDailyMinutes * 0.4),
            difficulty: 'medium'
          },
          {
            subject,
            topic,
            taskType: 'practice',
            description: `Timed practice - ${topic}`,
            timeAllotted: Math.floor(totalDailyMinutes * 0.6),
            difficulty: 'hard'
          }
        );
      }
      break;

    case 'weak-areas':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'video-lecture',
          description: `Watch conceptual video on ${topic} fundamentals`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.3),
          difficulty: 'easy'
        },
        {
          subject,
          topic,
          taskType: 'practice',
          description: `Intensive practice on ${topic} problem areas`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.7),
          difficulty: 'hard'
        }
      );
      break;

    case 'intensive-practice':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'speed-drill',
          description: `Speed solving drill - ${topic} (time pressure)`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.6),
          difficulty: 'hard'
        },
        {
          subject,
          topic,
          taskType: 'intensive-practice',
          description: `High-intensity problem marathon - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.4),
          difficulty: 'hard'
        }
      );
      break;

    case 'concept-mastery':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'concept-mapping',
          description: `Create concept map for ${topic} connections`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.3),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'concept-mastery',
          description: `Deep conceptual study of ${topic} principles`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.4),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'practice',
          description: `Apply ${topic} concepts to challenging problems`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.3),
          difficulty: 'hard'
        }
      );
      break;

    case 'exam-simulation':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'exam-simulation',
          description: `JEE-style exam simulation - ${topic} section`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.8),
          difficulty: 'hard'
        },
        {
          subject,
          topic,
          taskType: 'revision',
          description: `Quick review of ${topic} exam mistakes`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.2),
          difficulty: 'medium'
        }
      );
      break;

    case 'formula-sprint':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'formula-practice',
          description: `Formula derivation and memorization - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.6),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'speed-drill',
          description: `Quick formula application - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.4),
          difficulty: 'easy'
        }
      );
      break;

    case 'previous-years':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'previous-year',
          description: `Solve JEE previous year questions - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.7),
          difficulty: 'hard'
        },
        {
          subject,
          topic,
          taskType: 'revision',
          description: `Analyze ${topic} question patterns and solutions`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.3),
          difficulty: 'medium'
        }
      );
      break;

    case 'speed-accuracy':
      tasks.push(
        {
          subject,
          topic,
          taskType: 'speed-drill',
          description: `Speed practice - ${topic} (accuracy focus)`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.5),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'intensive-practice',
          description: `Timed problem solving - ${topic}`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.5),
          difficulty: 'hard'
        }
      );
      break;

    default:
      // full-syllabus or default
      tasks.push(
        {
          subject,
          topic,
          taskType: 'theory',
          description: `Study ${topic} concepts thoroughly`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.4),
          difficulty: 'medium'
        },
        {
          subject,
          topic,
          taskType: 'practice',
          description: `Solve ${topic} problems and examples`,
          timeAllotted: Math.floor(totalDailyMinutes * 0.6),
          difficulty: 'medium'
        }
      );
  }

  return tasks;
};

export const generateDailyTasksForChallenge = (challenge: Challenge): DailyTask[] => {
  const tasks: DailyTask[] = [];
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  // Get all topics from all subjects
  const allTopics: Array<{ subject: 'Physics' | 'Chemistry' | 'Mathematics'; topic: string }> = [];
  challenge.subjects.forEach(subject => {
    const subjectTopics = challenge.topics[subject] || [];
    subjectTopics.forEach(topic => {
      allTopics.push({ subject: subject as any, topic });
    });
  });

  if (allTopics.length === 0) {
    console.warn('No topics found for challenge:', challenge.id);
    return tasks;
  }

  // Distribute topics across days
  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const currentDate = addDays(startDate, dayIndex);
    const dateString = format(currentDate, 'yyyy-MM-dd');
    
    // Select topic(s) for this day (cycle through available topics)
    const topicsForDay = allTopics.filter((_, index) => index % totalDays === dayIndex % allTopics.length);
    
    if (topicsForDay.length === 0) {
      // Fallback: use the first available topic
      topicsForDay.push(allTopics[dayIndex % allTopics.length]);
    }

    // Generate tasks for each selected topic
    topicsForDay.forEach(({ subject, topic }) => {
      const taskTemplates = generateTasksForTopic(
        challenge.type,
        subject,
        topic,
        challenge.dailyTimeHours
      );

      taskTemplates.forEach((template, templateIndex) => {
        const task: DailyTask = {
          id: `${challenge.id}-${dateString}-${subject}-${templateIndex}`,
          challengeId: challenge.id,
          date: dateString,
          subject: template.subject,
          topic: template.topic,
          taskType: template.taskType,
          description: template.description,
          timeAllotted: template.timeAllotted,
          completed: false,
          difficulty: template.difficulty
        };

        tasks.push(task);
      });
    });
  }

  console.log(`Generated ${tasks.length} tasks for challenge: ${challenge.name}`);
  return tasks;
};

// Utility function to update challenge progress based on completed tasks
export const updateChallengeProgress = (challenge: Challenge, allTasks: DailyTask[]): Challenge => {
  const challengeTasks = allTasks.filter(task => task.challengeId === challenge.id);
  const completedTasks = challengeTasks.filter(task => task.completed);
  
  // Calculate completed days (days with at least one completed task)
  const completedDays = new Set(
    completedTasks.map(task => task.date)
  ).size;

  // Calculate current streak (consecutive days with completed tasks from most recent)
  const today = format(new Date(), 'yyyy-MM-dd');
  const challengeDates = [];
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    challengeDates.push(format(d, 'yyyy-MM-dd'));
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Calculate streaks
  const completedDateSet = new Set(completedTasks.map(task => task.date));
  
  for (const date of challengeDates.reverse()) {
    if (completedDateSet.has(date)) {
      if (date <= today) {
        if (currentStreak === 0 || challengeDates[challengeDates.indexOf(date) - 1] && completedDateSet.has(challengeDates[challengeDates.indexOf(date) - 1])) {
          currentStreak++;
        }
      }
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (date <= today) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  return {
    ...challenge,
    progress: {
      completedDays,
      totalDays: challenge.duration,
      completedTasks: completedTasks.length,
      totalTasks: challengeTasks.length,
      currentStreak,
      longestStreak: Math.max(challenge.progress.longestStreak, longestStreak)
    }
  };
};