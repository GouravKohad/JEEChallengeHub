import { type Challenge, type DailyTask, type InsertChallenge, type InsertDailyTask } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: string): Promise<boolean>;
  getTasks(challengeId?: string): Promise<DailyTask[]>;
  createTask(task: InsertDailyTask): Promise<DailyTask>;
  updateTask(id: string, updates: Partial<DailyTask>): Promise<DailyTask | undefined>;
}

export class MemStorage implements IStorage {
  private challenges: Map<string, Challenge>;
  private tasks: Map<string, DailyTask>;

  constructor() {
    this.challenges = new Map();
    this.tasks = new Map();
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      ...insertChallenge,
      id,
      createdAt: new Date().toISOString(),
      progress: {
        completedDays: 0,
        totalDays: insertChallenge.duration,
        completedTasks: 0,
        totalTasks: insertChallenge.duration * 3, // Estimated 3 tasks per day
        currentStreak: 0,
        longestStreak: 0
      }
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (challenge) {
      const updated = { ...challenge, ...updates };
      this.challenges.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    return this.challenges.delete(id);
  }

  async getTasks(challengeId?: string): Promise<DailyTask[]> {
    const tasks = Array.from(this.tasks.values());
    if (challengeId) {
      return tasks.filter(task => task.challengeId === challengeId);
    }
    return tasks;
  }

  async createTask(insertTask: InsertDailyTask): Promise<DailyTask> {
    const id = randomUUID();
    const task: DailyTask = {
      ...insertTask,
      id,
      completed: false
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<DailyTask>): Promise<DailyTask | undefined> {
    const task = this.tasks.get(id);
    if (task) {
      const updated = { ...task, ...updates };
      this.tasks.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
