import { Challenge, DailyTask } from "@shared/schema";

const STORAGE_KEYS = {
  CHALLENGES: 'jee-challenges',
  TASKS: 'jee-tasks',
  SETTINGS: 'jee-settings',
  TOPICS: 'jee-custom-topics'
} as const;

export interface StorageSettings {
  theme: 'light' | 'dark';
  userId: string;
}

export interface CustomTopics {
  Physics: string[];
  Chemistry: string[];
  Mathematics: string[];
}

export interface TopicCategory {
  id: string;
  name: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topics: string[];
}

// Challenge operations
export const challengeStorage = {
  getAll(): Challenge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load challenges from localStorage:', error);
      return [];
    }
  },

  save(challenges: Challenge[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (error) {
      console.error('Failed to save challenges to localStorage:', error);
    }
  },

  add(challenge: Challenge): Challenge[] {
    const challenges = this.getAll();
    challenges.unshift(challenge);
    this.save(challenges);
    return challenges;
  },

  update(challengeId: string, updates: Partial<Challenge>): Challenge[] {
    const challenges = this.getAll();
    const index = challenges.findIndex(c => c.id === challengeId);
    if (index !== -1) {
      challenges[index] = { ...challenges[index], ...updates };
      this.save(challenges);
    }
    return challenges;
  },

  remove(challengeId: string): Challenge[] {
    const challenges = this.getAll().filter(c => c.id !== challengeId);
    this.save(challenges);
    return challenges;
  },

  getById(challengeId: string): Challenge | undefined {
    return this.getAll().find(c => c.id === challengeId);
  }
};

// Task operations
export const taskStorage = {
  getAll(): DailyTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  },

  save(tasks: DailyTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  },

  getByDate(date: string): DailyTask[] {
    return this.getAll().filter(task => task.date === date);
  },

  getByChallengeId(challengeId: string): DailyTask[] {
    return this.getAll().filter(task => task.challengeId === challengeId);
  },

  add(task: DailyTask): DailyTask[] {
    const tasks = this.getAll();
    tasks.push(task);
    this.save(tasks);
    return tasks;
  },

  addBatch(newTasks: DailyTask[]): DailyTask[] {
    const tasks = this.getAll();
    tasks.push(...newTasks);
    this.save(tasks);
    return tasks;
  },

  update(taskId: string, updates: Partial<DailyTask>): DailyTask[] {
    const tasks = this.getAll();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      
      // Update completion timestamp if task is being marked as completed
      if (updates.completed === true && !tasks[index].completedAt) {
        tasks[index].completedAt = new Date().toISOString();
      } else if (updates.completed === false) {
        delete tasks[index].completedAt;
      }
      
      this.save(tasks);
    }
    return tasks;
  },

  remove(taskId: string): DailyTask[] {
    const tasks = this.getAll().filter(t => t.id !== taskId);
    this.save(tasks);
    return tasks;
  },

  removeByChallengeId(challengeId: string): DailyTask[] {
    const tasks = this.getAll().filter(t => t.challengeId !== challengeId);
    this.save(tasks);
    return tasks;
  }
};

// Settings operations
export const settingsStorage = {
  get(): StorageSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        theme: 'light',
        userId: `user-${Date.now()}`
      };
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return {
        theme: 'light',
        userId: `user-${Date.now()}`
      };
    }
  },

  save(settings: StorageSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  },

  updateTheme(theme: 'light' | 'dark'): StorageSettings {
    const settings = this.get();
    settings.theme = theme;
    this.save(settings);
    return settings;
  }
};

// Custom Topics operations
export const topicStorage = {
  getAll(): CustomTopics {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOPICS);
      return data ? JSON.parse(data) : { Physics: [], Chemistry: [], Mathematics: [] };
    } catch (error) {
      console.error('Failed to load custom topics from localStorage:', error);
      return { Physics: [], Chemistry: [], Mathematics: [] };
    }
  },

  save(topics: CustomTopics): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
    } catch (error) {
      console.error('Failed to save custom topics to localStorage:', error);
    }
  },

  addTopic(subject: 'Physics' | 'Chemistry' | 'Mathematics', topic: string): CustomTopics {
    const topics = this.getAll();
    if (!topics[subject].includes(topic)) {
      topics[subject].push(topic);
      this.save(topics);
    }
    return topics;
  },

  updateTopic(subject: 'Physics' | 'Chemistry' | 'Mathematics', oldTopic: string, newTopic: string): CustomTopics {
    const topics = this.getAll();
    const index = topics[subject].indexOf(oldTopic);
    if (index !== -1) {
      topics[subject][index] = newTopic;
      this.save(topics);
    }
    return topics;
  },

  removeTopic(subject: 'Physics' | 'Chemistry' | 'Mathematics', topic: string): CustomTopics {
    const topics = this.getAll();
    topics[subject] = topics[subject].filter(t => t !== topic);
    this.save(topics);
    return topics;
  },

  addMultipleTopics(subject: 'Physics' | 'Chemistry' | 'Mathematics', newTopics: string[]): CustomTopics {
    const topics = this.getAll();
    newTopics.forEach(topic => {
      if (!topics[subject].includes(topic)) {
        topics[subject].push(topic);
      }
    });
    this.save(topics);
    return topics;
  },

  clear(): CustomTopics {
    const emptyTopics = { Physics: [], Chemistry: [], Mathematics: [] };
    this.save(emptyTopics);
    return emptyTopics;
  }
};

// Utility functions
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All JEE Challenge Hub data cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const exportData = () => {
  return {
    challenges: challengeStorage.getAll(),
    tasks: taskStorage.getAll(),
    settings: settingsStorage.get(),
    topics: topicStorage.getAll(),
    exportDate: new Date().toISOString()
  };
};

export const importData = (data: ReturnType<typeof exportData>) => {
  try {
    if (data.challenges) challengeStorage.save(data.challenges);
    if (data.tasks) taskStorage.save(data.tasks);
    if (data.settings) settingsStorage.save(data.settings);
    if (data.topics) topicStorage.save(data.topics);
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Failed to import data:', error);
  }
};