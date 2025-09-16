import { z } from "zod";

// JEE Subjects and Topics
export const JEE_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;

export const JEE_TOPICS = {
  Physics: [
    'Units and Dimensions', 'Vectors', 'Motion in a Straight Line', 'Motion in a Plane',
    'Laws of Motion', 'Friction', 'Work, Energy and Power', 'System of Particles and Rotational Motion',
    'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids',
    'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory', 'Oscillations',
    'Waves', 'Electric Charges and Fields', 'Electrostatic Potential', 'Current Electricity',
    'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction',
    'Alternating Current', 'Electromagnetic Waves', 'Ray Optics', 'Wave Optics',
    'Dual Nature of Radiation', 'Atoms', 'Nuclei', 'Semiconductor Electronics'
  ],
  Chemistry: [
    'Mole Concept', 'Atomic Structure', 'Periodic Table', 'Chemical Bonding',
    'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions',
    'Hydrogen', 's-Block Elements', 'p-Block Elements', 'd-Block Elements',
    'f-Block Elements', 'Coordination Compounds', 'Environmental Chemistry',
    'Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics',
    'Surface Chemistry', 'General Principles of Metallurgy', 'Organic Chemistry Basics',
    'Hydrocarbons', 'Haloalkanes and Haloarenes', 'Alcohols Phenols and Ethers',
    'Aldehydes Ketones and Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers',
    'Chemistry in Everyday Life'
  ],
  Mathematics: [
    'Sets', 'Relations and Functions', 'Trigonometric Functions', 'Mathematical Induction',
    'Complex Numbers', 'Linear Inequalities', 'Permutations and Combinations',
    'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections',
    'Introduction to 3D Geometry', 'Limits and Derivatives', 'Mathematical Reasoning',
    'Statistics', 'Probability', 'Matrices', 'Determinants', 'Continuity and Differentiability',
    'Applications of Derivatives', 'Integrals', 'Applications of Integrals',
    'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry',
    'Linear Programming'
  ]
} as const;

export const CHALLENGE_TYPES = [
  { id: 'revision', name: '15 Days Revision Challenge', duration: 15, description: 'Complete revision of selected topics' },
  { id: 'backlog', name: '20 Days Backlog Completion', duration: 20, description: 'Clear your pending syllabus' },
  { id: 'dpp', name: '30 Days DPP Challenge', duration: 30, description: 'Daily Practice Problems marathon' },
  { id: 'mock', name: '45 Days Mock Test Series', duration: 45, description: 'Intensive mock test preparation' },
  { id: 'weak-areas', name: '14 Days Weak Areas Focus', duration: 14, description: 'Target your weak subjects/topics' },
  { id: 'full-syllabus', name: '60 Days Complete Syllabus', duration: 60, description: 'Cover entire JEE syllabus systematically' }
] as const;

// Schema definitions
export const challengeSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  duration: z.number(),
  subjects: z.array(z.enum(JEE_SUBJECTS)),
  topics: z.record(z.array(z.string())),
  startDate: z.string(),
  endDate: z.string(),
  dailyTimeHours: z.number().min(1).max(12),
  status: z.enum(['active', 'completed', 'paused', 'archived']),
  createdAt: z.string(),
  progress: z.object({
    completedDays: z.number(),
    totalDays: z.number(),
    completedTasks: z.number(),
    totalTasks: z.number(),
    currentStreak: z.number(),
    longestStreak: z.number()
  })
});

export const dailyTaskSchema = z.object({
  id: z.string(),
  challengeId: z.string(),
  date: z.string(),
  subject: z.enum(JEE_SUBJECTS),
  topic: z.string(),
  taskType: z.enum(['theory', 'practice', 'revision', 'mock-test', 'dpp']),
  description: z.string(),
  timeAllotted: z.number(), // in minutes
  completed: z.boolean(),
  completedAt: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  notes: z.string().optional()
});

export const insertChallengeSchema = challengeSchema.omit({ id: true, createdAt: true, progress: true });
export const insertDailyTaskSchema = dailyTaskSchema.omit({ id: true, completed: true, completedAt: true });

export type Challenge = z.infer<typeof challengeSchema>;
export type DailyTask = z.infer<typeof dailyTaskSchema>;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type InsertDailyTask = z.infer<typeof insertDailyTaskSchema>;
export type Subject = typeof JEE_SUBJECTS[number];
export type ChallengeType = typeof CHALLENGE_TYPES[number];
