import { z } from "zod";

// JEE Subjects and Topics
export const JEE_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const;

export const JEE_TOPICS = {
  Physics: [
    // Mechanics
    'Units and Dimensions', 'Significant Figures', 'Error Analysis',
    'Scalars and Vectors', 'Vector Addition', 'Vector Multiplication',
    'Kinematics - Distance and Displacement', 'Speed and Velocity', 'Acceleration',
    'Equations of Motion', 'Graphs of Motion', 'Relative Motion',
    'Projectile Motion', 'Circular Motion', 'Banking of Roads',
    'Newton\'s Laws of Motion', 'Inertia', 'Momentum', 'Impulse',
    'Static and Kinetic Friction', 'Laws of Friction', 'Motion on Inclined Plane',
    'Work', 'Energy', 'Power', 'Conservative and Non-conservative Forces',
    'Collision in 1D and 2D', 'Centre of Mass', 'Angular Motion',
    'Moment of Inertia', 'Torque', 'Angular Momentum',
    'Kepler\'s Laws', 'Universal Law of Gravitation', 'Gravitational Field',
    'Gravitational Potential', 'Escape Velocity', 'Satellite Motion',
    
    // Properties of Matter
    'Elasticity', 'Stress and Strain', 'Young\'s Modulus', 'Bulk Modulus',
    'Fluid Statics', 'Pascal\'s Law', 'Archimedes Principle',
    'Fluid Dynamics', 'Bernoulli\'s Theorem', 'Viscosity', 'Surface Tension',
    
    // Heat and Thermodynamics
    'Temperature and Heat', 'Thermal Expansion', 'Calorimetry',
    'Heat Transfer', 'Laws of Thermodynamics', 'Isothermal and Adiabatic Processes',
    'Heat Engines', 'Refrigerators', 'Entropy',
    'Kinetic Theory of Gases', 'Gas Laws', 'Mean Free Path',
    
    // Oscillations and Waves
    'Simple Harmonic Motion', 'Pendulum', 'Springs',
    'Wave Motion', 'Wave Equation', 'Sound Waves',
    'Doppler Effect', 'Beats', 'Resonance', 'Standing Waves',
    
    // Electricity and Magnetism
    'Coulomb\'s Law', 'Electric Field', 'Gauss\'s Law',
    'Electric Potential', 'Capacitance', 'Dielectrics',
    'Electric Current', 'Ohm\'s Law', 'Resistance', 'Resistivity',
    'Series and Parallel Circuits', 'Kirchhoff\'s Laws', 'Wheatstone Bridge',
    'Magnetic Field', 'Biot-Savart Law', 'Ampere\'s Law',
    'Force on Current Carrying Conductor', 'Magnetic Dipole',
    'Electromagnetic Induction', 'Faraday\'s Law', 'Lenz\'s Law',
    'Self and Mutual Inductance', 'LR Circuits',
    'AC Circuits', 'RLC Circuits', 'Resonance in AC Circuits',
    'Transformer', 'AC Generator',
    
    // Electromagnetic Waves and Optics
    'Maxwell\'s Equations', 'Electromagnetic Spectrum',
    'Reflection and Refraction', 'Total Internal Reflection',
    'Lens Formula', 'Mirror Formula', 'Optical Instruments',
    'Interference', 'Young\'s Double Slit', 'Diffraction',
    'Polarization', 'Scattering',
    
    // Modern Physics
    'Photoelectric Effect', 'Compton Effect', 'de Broglie Waves',
    'Bohr\'s Atomic Model', 'Hydrogen Spectrum', 'X-rays',
    'Radioactivity', 'Nuclear Reactions', 'Mass-Energy Equivalence',
    'p-n Junction', 'Transistors', 'Logic Gates'
  ],
  Chemistry: [
    // Physical Chemistry
    'Mole Concept and Stoichiometry', 'Atomic Mass', 'Molecular Mass',
    'Empirical and Molecular Formula', 'Percentage Composition',
    'Thomson\'s Model', 'Rutherford\'s Model', 'Bohr\'s Model',
    'Quantum Numbers', 'Electronic Configuration', 'Aufbau Principle',
    'Hund\'s Rule', 'Pauli Exclusion Principle',
    'Mendeleev\'s Periodic Law', 'Modern Periodic Law', 'Periodic Trends',
    'Ionization Energy', 'Electron Affinity', 'Electronegativity',
    'Ionic Bonding', 'Covalent Bonding', 'Metallic Bonding',
    'VSEPR Theory', 'Hybridization', 'Molecular Orbital Theory',
    'Gas Laws', 'Ideal Gas Equation', 'Real Gases',
    'Kinetic Theory', 'Liquid State', 'Solid State',
    'Crystal Lattices', 'Unit Cells', 'Packing Efficiency',
    'First Law of Thermodynamics', 'Enthalpy', 'Entropy',
    'Gibbs Free Energy', 'Spontaneity', 'Hess\'s Law',
    'Chemical Equilibrium', 'Le Chatelier\'s Principle', 'Equilibrium Constants',
    'Acid-Base Equilibrium', 'pH and pOH', 'Buffer Solutions',
    'Solubility Product', 'Common Ion Effect',
    'Solutions and Colligative Properties', 'Raoult\'s Law', 'Vapour Pressure Lowering',
    'Elevation of Boiling Point', 'Depression of Freezing Point', 'Osmotic Pressure',
    'Van\'t Hoff Factor', 'Abnormal Molecular Mass',
    'Oxidation and Reduction', 'Balancing Redox Equations',
    'Electrochemical Cells', 'EMF', 'Nernst Equation',
    'Electrolysis', 'Faraday\'s Laws',
    'Rate of Reaction', 'Order and Molecularity', 'Rate Laws',
    'Arrhenius Equation', 'Collision Theory', 'Catalysis',
    'Adsorption', 'Colloids', 'Emulsions',
    
    // Inorganic Chemistry
    'Occurrence and Extraction', 'Properties of Hydrogen',
    'Hydrides', 'Water', 'Hydrogen Peroxide',
    'Alkali Metals', 'Alkaline Earth Metals', 'Group Trends',
    'Boron Family', 'Carbon Family', 'Nitrogen Family',
    'Oxygen Family', 'Halogen Family', 'Noble Gases',
    'Transition Elements', 'Inner Transition Elements',
    'Coordination Compounds', 'Crystal Field Theory',
    'Ligands', 'Nomenclature', 'Isomerism in Complexes',
    'Environmental Pollution', 'Green Chemistry',
    'Metallurgy', 'Extraction of Metals', 'Refining',
    
    // Organic Chemistry
    'Classification of Organic Compounds', 'IUPAC Nomenclature',
    'Isomerism', 'Reaction Mechanisms', 'Inductive Effect',
    'Resonance', 'Hyperconjugation', 'Electrophiles and Nucleophiles',
    'Alkanes', 'Preparation and Properties', 'Conformations',
    'Alkenes', 'Geometric Isomerism', 'Markovnikov\'s Rule',
    'Alkynes', 'Acidic Nature', 'Reactions',
    'Aromatic Compounds', 'Benzene', 'Electrophilic Substitution',
    'Haloalkanes', 'Nucleophilic Substitution', 'Elimination Reactions',
    'Haloarenes', 'Nucleophilic Aromatic Substitution',
    'Alcohols', 'Preparation and Properties', 'Dehydration',
    'Phenols', 'Acidity', 'Electrophilic Substitution',
    'Ethers', 'Preparation', 'Cleavage Reactions',
    'Aldehydes and Ketones', 'Carbonyl Chemistry', 'Aldol Reactions',
    'Carboxylic Acids', 'Acidity', 'Derivatives',
    'Amines', 'Basicity', 'Diazotization',
    'Carbohydrates', 'Proteins', 'Amino Acids',
    'Nucleic Acids', 'Vitamins', 'Hormones',
    'Polymers', 'Addition Polymers', 'Condensation Polymers',
    'Drugs', 'Detergents', 'Food Chemistry'
  ],
  Mathematics: [
    // Algebra
    'Sets and Relations', 'Types of Relations', 'Equivalence Relations',
    'Functions', 'Types of Functions', 'Composite Functions',
    'Inverse Functions', 'Binary Operations',
    'Trigonometric Ratios', 'Trigonometric Identities',
    'Trigonometric Equations', 'Inverse Trigonometric Functions',
    'Principal of Mathematical Induction', 'Applications',
    'Complex Numbers', 'Argand Plane', 'De Moivre\'s Theorem',
    'Roots of Unity', 'Quadratic Equations in Complex Numbers',
    'Linear Inequalities', 'Graphical Solution', 'Linear Programming',
    'Permutations', 'Combinations', 'Circular Permutations',
    'Restricted Permutations', 'Distribution Problems',
    'Binomial Theorem', 'General Term', 'Greatest Coefficient',
    'Arithmetic Progression', 'Geometric Progression', 'Harmonic Progression',
    'Arithmetic-Geometric Progression', 'Sum of Special Series',
    'Quadratic Equations', 'Nature of Roots', 'Sum and Product of Roots',
    'Theory of Equations', 'Relation between Roots and Coefficients',
    
    // Coordinate Geometry
    'Cartesian Coordinates', 'Distance Formula', 'Section Formula',
    'Straight Lines', 'Slope', 'Angle between Lines',
    'Distance from Point to Line', 'Family of Lines',
    'Circle', 'Equation of Circle', 'Tangent and Normal',
    'Chord Properties', 'Power of Point',
    'Parabola', 'Standard Equation', 'Focal Chord Properties',
    'Ellipse', 'Standard Equation', 'Eccentricity',
    'Hyperbola', 'Standard Equation', 'Asymptotes',
    'Three Dimensional Coordinates', 'Direction Cosines',
    'Distance and Section Formula in 3D', 'Plane',
    'Straight Line in 3D', 'Angle between Lines and Planes',
    
    // Calculus
    'Limits', 'Evaluation of Limits', 'L\'Hospital\'s Rule',
    'Continuity', 'Differentiability', 'Derivatives',
    'Chain Rule', 'Implicit Differentiation', 'Logarithmic Differentiation',
    'Parametric Differentiation', 'Higher Order Derivatives',
    'Mean Value Theorems', 'Increasing and Decreasing Functions',
    'Maxima and Minima', 'Concavity', 'Curve Sketching',
    'Rate of Change', 'Related Rates', 'Tangent and Normal',
    'Indefinite Integration', 'Methods of Integration',
    'Integration by Parts', 'Partial Fractions',
    'Definite Integration', 'Properties of Definite Integrals',
    'Area under Curves', 'Area between Curves',
    'Volume of Solids of Revolution',
    'Differential Equations', 'Order and Degree',
    'Variables Separable', 'Homogeneous Equations',
    'Linear Differential Equations', 'Applications',
    
    // Vector Algebra and Geometry
    'Vector Addition', 'Scalar and Vector Products',
    'Scalar Triple Product', 'Vector Triple Product',
    'Vector Equations of Line and Plane',
    'Angle between Vectors', 'Projection of Vectors',
    
    // Statistics and Probability
    'Measures of Central Tendency', 'Measures of Dispersion',
    'Correlation and Regression', 'Probability',
    'Addition and Multiplication Theorems', 'Conditional Probability',
    'Bayes\' Theorem', 'Random Variables', 'Probability Distributions',
    'Binomial Distribution', 'Normal Distribution',
    
    // Mathematical Reasoning
    'Statements', 'Logical Connectives', 'Truth Tables',
    'Conditional Statements', 'Converse and Contrapositive',
    'Mathematical Proofs', 'Proof by Contradiction',
    
    // Matrices and Determinants
    'Types of Matrices', 'Matrix Operations', 'Transpose',
    'Symmetric and Skew Symmetric Matrices', 'Inverse of Matrix',
    'Elementary Row Operations', 'Rank of Matrix',
    'Determinants', 'Properties of Determinants', 'Cofactors',
    'Adjoint of Matrix', 'Cramer\'s Rule',
    'System of Linear Equations', 'Homogeneous Equations'
  ]
} as const;

export const CHALLENGE_TYPES = [
  { id: 'revision', name: '15 Days Revision Challenge', duration: 15, description: 'Complete revision of selected topics' },
  { id: 'backlog', name: '20 Days Backlog Completion', duration: 20, description: 'Clear your pending syllabus' },
  { id: 'dpp', name: '30 Days DPP Challenge', duration: 30, description: 'Daily Practice Problems marathon' },
  { id: 'mock', name: '45 Days Mock Test Series', duration: 45, description: 'Intensive mock test preparation' },
  { id: 'weak-areas', name: '14 Days Weak Areas Focus', duration: 14, description: 'Target your weak subjects/topics' },
  { id: 'full-syllabus', name: '60 Days Complete Syllabus', duration: 60, description: 'Cover entire JEE syllabus systematically' },
  { id: 'intensive-practice', name: '21 Days Intensive Practice', duration: 21, description: 'High-intensity problem solving with time constraints' },
  { id: 'concept-mastery', name: '28 Days Concept Mastery', duration: 28, description: 'Deep conceptual understanding through theory and applications' },
  { id: 'exam-simulation', name: '10 Days Exam Simulation', duration: 10, description: 'Realistic JEE exam conditions and time management' },
  { id: 'formula-sprint', name: '7 Days Formula Sprint', duration: 7, description: 'Quick revision of all important formulas and derivations' },
  { id: 'previous-years', name: '25 Days Previous Year Questions', duration: 25, description: 'Solve and analyze past JEE questions topic-wise' },
  { id: 'speed-accuracy', name: '18 Days Speed & Accuracy', duration: 18, description: 'Improve solving speed while maintaining accuracy' }
] as const;

// Schema definitions
export const challengeSchema = z.object({
  id: z.string(),
  type: z.enum(['revision', 'backlog', 'dpp', 'mock', 'weak-areas', 'full-syllabus', 'intensive-practice', 'concept-mastery', 'exam-simulation', 'formula-sprint', 'previous-years', 'speed-accuracy']),
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
  taskType: z.enum(['theory', 'practice', 'revision', 'mock-test', 'dpp', 'concept-mastery', 'intensive-practice', 'exam-simulation', 'formula-practice', 'previous-year', 'speed-drill', 'video-lecture', 'concept-mapping']),
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
