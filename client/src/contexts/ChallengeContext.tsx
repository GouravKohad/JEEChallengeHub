import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Challenge, DailyTask, InsertChallenge } from '@shared/schema';
import { challengeStorage, taskStorage } from '@/lib/localStorage';
import { generateDailyTasksForChallenge, updateChallengeProgress } from '@/lib/taskGenerator';

interface ChallengeState {
  challenges: Challenge[];
  tasks: DailyTask[];
  loading: boolean;
  error: string | null;
}

type ChallengeAction =
  | { type: 'LOAD_SUCCESS'; challenges: Challenge[]; tasks: DailyTask[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'ADD_CHALLENGE'; challenge: Challenge }
  | { type: 'UPDATE_CHALLENGE'; challengeId: string; updates: Partial<Challenge> }
  | { type: 'DELETE_CHALLENGE'; challengeId: string }
  | { type: 'ADD_TASKS'; tasks: DailyTask[] }
  | { type: 'UPDATE_TASK'; taskId: string; updates: Partial<DailyTask> }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'REFRESH_PROGRESS'; challengeId: string };

const initialState: ChallengeState = {
  challenges: [],
  tasks: [],
  loading: true,
  error: null,
};

function challengeReducer(state: ChallengeState, action: ChallengeAction): ChallengeState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        challenges: action.challenges,
        tasks: action.tasks,
        loading: false,
        error: null,
      };
    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'ADD_CHALLENGE':
      return {
        ...state,
        challenges: [action.challenge, ...state.challenges],
      };
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(c =>
          c.id === action.challengeId ? { ...c, ...action.updates } : c
        ),
      };
    case 'DELETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.filter(c => c.id !== action.challengeId),
        tasks: state.tasks.filter(t => t.challengeId !== action.challengeId),
      };
    case 'ADD_TASKS':
      return {
        ...state,
        tasks: [...state.tasks, ...action.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.taskId ? { ...t, ...action.updates } : t
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.taskId),
      };
    case 'REFRESH_PROGRESS':
      const challengeToUpdate = state.challenges.find(c => c.id === action.challengeId);
      if (challengeToUpdate) {
        const updatedChallenge = updateChallengeProgress(challengeToUpdate, state.tasks);
        return {
          ...state,
          challenges: state.challenges.map(c =>
            c.id === action.challengeId ? updatedChallenge : c
          ),
        };
      }
      return state;
    default:
      return state;
  }
}

interface ChallengeContextType {
  state: ChallengeState;
  createChallenge: (challenge: InsertChallenge) => Promise<void>;
  updateChallenge: (challengeId: string, updates: Partial<Challenge>) => Promise<void>;
  deleteChallenge: (challengeId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<DailyTask>) => Promise<void>;
  addTask: (task: Omit<DailyTask, 'id'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTasksForDate: (date: string) => DailyTask[];
  getTasksForChallenge: (challengeId: string) => DailyTask[];
  getChallengeStats: () => {
    total: number;
    active: number;
    completed: number;
    paused: number;
    currentStreak: number;
    totalStudyHours: number;
    totalTasksCompleted: number;
  };
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(challengeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const challenges = challengeStorage.getAll();
      const tasks = taskStorage.getAll();
      
      // Update progress for all challenges based on current tasks
      const updatedChallenges = challenges.map(challenge => 
        updateChallengeProgress(challenge, tasks)
      );
      
      // Save updated challenges back to storage
      if (JSON.stringify(challenges) !== JSON.stringify(updatedChallenges)) {
        challengeStorage.save(updatedChallenges);
      }
      
      dispatch({ type: 'LOAD_SUCCESS', challenges: updatedChallenges, tasks });
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      dispatch({ type: 'LOAD_ERROR', error: 'Failed to load data' });
    }
  }, []);

  const createChallenge = async (insertChallenge: InsertChallenge) => {
    try {
      // Create challenge with initial progress
      const challenge: Challenge = {
        ...insertChallenge,
        id: `challenge-${Date.now()}`,
        createdAt: new Date().toISOString(),
        progress: {
          completedDays: 0,
          totalDays: insertChallenge.duration,
          completedTasks: 0,
          totalTasks: 0, // Will be updated after tasks are generated
          currentStreak: 0,
          longestStreak: 0,
        },
      };

      // Generate daily tasks for the challenge
      const generatedTasks = generateDailyTasksForChallenge(challenge);
      
      // Update challenge with correct total tasks count
      challenge.progress.totalTasks = generatedTasks.length;

      // Save to localStorage
      challengeStorage.add(challenge);
      taskStorage.addBatch(generatedTasks);

      // Update state
      dispatch({ type: 'ADD_CHALLENGE', challenge });
      dispatch({ type: 'ADD_TASKS', tasks: generatedTasks });

      console.log(`Created challenge "${challenge.name}" with ${generatedTasks.length} tasks`);
    } catch (error) {
      console.error('Failed to create challenge:', error);
      throw error;
    }
  };

  const updateChallenge = async (challengeId: string, updates: Partial<Challenge>) => {
    try {
      challengeStorage.update(challengeId, updates);
      dispatch({ type: 'UPDATE_CHALLENGE', challengeId, updates });
      
      // Refresh progress after update
      setTimeout(() => {
        dispatch({ type: 'REFRESH_PROGRESS', challengeId });
      }, 100);
    } catch (error) {
      console.error('Failed to update challenge:', error);
      throw error;
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      challengeStorage.remove(challengeId);
      taskStorage.removeByChallengeId(challengeId);
      dispatch({ type: 'DELETE_CHALLENGE', challengeId });
    } catch (error) {
      console.error('Failed to delete challenge:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<DailyTask>) => {
    try {
      // Add completion timestamp if marking as completed
      const finalUpdates = { ...updates };
      if (updates.completed === true) {
        finalUpdates.completedAt = new Date().toISOString();
      } else if (updates.completed === false) {
        delete finalUpdates.completedAt;
      }

      taskStorage.update(taskId, finalUpdates);
      dispatch({ type: 'UPDATE_TASK', taskId, updates: finalUpdates });

      // Find the challenge this task belongs to and refresh its progress
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        setTimeout(() => {
          dispatch({ type: 'REFRESH_PROGRESS', challengeId: task.challengeId });
          challengeStorage.update(task.challengeId, {}); // Trigger storage update
        }, 100);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const addTask = async (taskData: Omit<DailyTask, 'id'>) => {
    try {
      const task: DailyTask = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        completed: false,
      };

      taskStorage.add(task);
      dispatch({ type: 'ADD_TASKS', tasks: [task] });

      // Refresh progress for the challenge this task belongs to
      setTimeout(() => {
        dispatch({ type: 'REFRESH_PROGRESS', challengeId: task.challengeId });
        challengeStorage.update(task.challengeId, {}); // Trigger storage update
      }, 100);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Find the task to get the challenge ID before deleting
      const task = state.tasks.find(t => t.id === taskId);
      
      taskStorage.remove(taskId);
      dispatch({ type: 'DELETE_TASK', taskId });

      // Refresh progress for the challenge this task belonged to
      if (task) {
        setTimeout(() => {
          dispatch({ type: 'REFRESH_PROGRESS', challengeId: task.challengeId });
          challengeStorage.update(task.challengeId, {}); // Trigger storage update
        }, 100);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const getTasksForDate = (date: string): DailyTask[] => {
    // Build a map of challengeId -> status for efficient lookups
    const challengeStatusMap = new Map(
      state.challenges.map(challenge => [challenge.id, challenge.status])
    );

    return state.tasks.filter(task => {
      if (task.date !== date) return false;
      
      // Check if the challenge exists and is not paused
      const challengeStatus = challengeStatusMap.get(task.challengeId);
      return challengeStatus && challengeStatus !== 'paused';
    });
  };

  const getTasksForChallenge = (challengeId: string): DailyTask[] => {
    return state.tasks.filter(task => task.challengeId === challengeId);
  };

  const getChallengeStats = () => {
    const { challenges } = state;
    const active = challenges.filter(c => c.status === 'active');
    const completed = challenges.filter(c => c.status === 'completed');
    const paused = challenges.filter(c => c.status === 'paused');
    
    const currentStreak = Math.max(0, ...challenges.map(c => c.progress.currentStreak));
    const totalStudyHours = challenges.reduce((acc, c) => 
      acc + (c.progress.completedDays * c.dailyTimeHours), 0
    );
    const totalTasksCompleted = challenges.reduce((acc, c) => 
      acc + c.progress.completedTasks, 0
    );

    return {
      total: challenges.length,
      active: active.length,
      completed: completed.length,
      paused: paused.length,
      currentStreak,
      totalStudyHours,
      totalTasksCompleted,
    };
  };

  const value: ChallengeContextType = {
    state,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    updateTask,
    addTask,
    deleteTask,
    getTasksForDate,
    getTasksForChallenge,
    getChallengeStats,
  };

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
}