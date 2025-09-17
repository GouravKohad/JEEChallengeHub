import { JEE_TOPICS, JEE_CHAPTERS, getChaptersForSubject, getTopicsForChapter, getAllTopicsForSubject as getSchemaTopics, getChapterForTopic } from '@shared/schema';
import { CustomTopics, CustomTopicWithClass, topicStorage } from '@/lib/localStorage';

// Helper function to get all topics (default + custom) for a subject
export const getAllTopicsForSubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics'): string[] => {
  const defaultTopics = JEE_TOPICS[subject];
  const customTopics = topicStorage.getAll();
  
  // Merge default and custom topics, removing duplicates
  const customTopicNames = customTopics[subject].map(topic => topic.name);
  const allTopics = [...defaultTopics, ...customTopicNames];
  return Array.from(new Set(allTopics)).sort();
};

// Helper function to get all topics for all subjects
export const getAllTopics = (): { Physics: string[]; Chemistry: string[]; Mathematics: string[] } => {
  return {
    Physics: getAllTopicsForSubject('Physics'),
    Chemistry: getAllTopicsForSubject('Chemistry'),
    Mathematics: getAllTopicsForSubject('Mathematics')
  };
};

// Helper function to check if a topic is custom (not in default list)
export const isCustomTopic = (subject: 'Physics' | 'Chemistry' | 'Mathematics', topic: string): boolean => {
  return !(JEE_TOPICS[subject] as readonly string[]).includes(topic);
};

// Helper function to get only custom topics
export const getCustomTopics = (): CustomTopics => {
  return topicStorage.getAll();
};

// Helper function to organize topics by category/chapter (for display purposes)
export const organizeTopicsByCategory = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  const categories: { [key: string]: string[] } = {};
  
  // Get default topics organized by chapters from the new schema
  const chapters = getChaptersForSubject(subject);
  
  chapters.forEach(chapter => {
    const chapterTopics = getTopicsForChapter(subject, chapter);
    if (chapterTopics.length > 0) {
      categories[chapter] = chapterTopics;
    }
  });
  
  // Add custom topics to a separate category
  const customTopics = topicStorage.getAll()[subject];
  if (customTopics.length > 0) {
    categories['Custom Topics'] = customTopics.map(topic => topic.name);
  }
  
  return categories;
};

// New chapter-aware helper functions

// Helper function to get all chapters with their topics (including custom)
export const getChaptersWithTopics = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  const chapters = getChaptersForSubject(subject);
  const result: { [chapter: string]: string[] } = {};
  
  chapters.forEach(chapter => {
    result[chapter] = getTopicsForChapter(subject, chapter);
  });
  
  // Add custom topics if they exist
  const customTopics = topicStorage.getAll()[subject];
  if (customTopics.length > 0) {
    result['Custom Topics'] = customTopics.map(topic => topic.name);
  }
  
  return result;
};

// Helper function to get chapter for a topic (including custom topics)
export const getTopicChapter = (subject: 'Physics' | 'Chemistry' | 'Mathematics', topic: string): string => {
  // First check if it's a custom topic
  if (isCustomTopic(subject, topic)) {
    return 'Custom Topics';
  }
  
  // Otherwise, get the chapter from the schema
  return getChapterForTopic(subject, topic) || 'Unknown';
};

// Helper function for topic search
export const searchTopics = (query: string, subject?: 'Physics' | 'Chemistry' | 'Mathematics') => {
  const lowercaseQuery = query.toLowerCase();
  
  if (subject) {
    return getAllTopicsForSubject(subject).filter(topic => 
      topic.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  const allTopics = getAllTopics();
  const results: { subject: string; topics: string[] }[] = [];
  
  Object.entries(allTopics).forEach(([subjectName, topics]) => {
    const matchingTopics = topics.filter(topic => 
      topic.toLowerCase().includes(lowercaseQuery)
    );
    if (matchingTopics.length > 0) {
      results.push({ subject: subjectName, topics: matchingTopics });
    }
  });
  
  return results;
};

// Grade-level chapter mappings for JEE syllabus
const GRADE_LEVEL_CHAPTERS = {
  Physics: {
    '11th Grade': ['Mechanics', 'Properties of Matter', 'Heat and Thermodynamics', 'Oscillations and Waves'],
    '12th Grade': ['Electricity and Magnetism', 'Electromagnetic Waves and Optics', 'Modern Physics']
  },
  Chemistry: {
    '11th Grade': ['Physical Chemistry'],
    '12th Grade': ['Inorganic Chemistry', 'Organic Chemistry']
  },
  Mathematics: {
    '11th Grade': ['Algebra', 'Coordinate Geometry', 'Mathematical Reasoning', 'Statistics and Probability'],
    '12th Grade': ['Calculus', 'Vector Algebra and Geometry', 'Matrices and Determinants']
  }
} as const;

// Helper function to get chapters organized by grade levels
export const getChaptersByGrade = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  const result: { [grade: string]: { [chapter: string]: string[] } } = {
    '11th Grade': {},
    '12th Grade': {}
  };
  
  // Get all chapters from schema to ensure complete coverage
  const allChapters = getChaptersForSubject(subject);
  const mappedChapters = new Set<string>();
  
  // Organize mapped chapters by grade level
  const gradeChapters = GRADE_LEVEL_CHAPTERS[subject];
  
  Object.entries(gradeChapters).forEach(([grade, chapters]) => {
    chapters.forEach((chapter: string) => {
      const topics = getTopicsForChapter(subject, chapter);
      if (topics.length > 0) {
        result[grade][chapter] = topics;
        mappedChapters.add(chapter);
      }
    });
  });
  
  // Add any unmapped chapters to 12th Grade as fallback
  const unmappedChapters = allChapters.filter(chapter => !mappedChapters.has(chapter));
  unmappedChapters.forEach((chapter: string) => {
    const topics = getTopicsForChapter(subject, chapter);
    if (topics.length > 0) {
      result['12th Grade'][chapter] = topics;
    }
  });
  
  // Add custom topics to their respective grade sections
  const customTopics = topicStorage.getAll()[subject];
  if (customTopics.length > 0) {
    // Group custom topics by class
    const customTopicsByClass = {
      '11th': customTopics.filter(topic => topic.class === '11th').map(topic => topic.name),
      '12th': customTopics.filter(topic => topic.class === '12th').map(topic => topic.name)
    };
    
    // Add custom topics to their respective grades
    if (customTopicsByClass['11th'].length > 0) {
      result['11th Grade']['Custom Topics'] = customTopicsByClass['11th'];
    }
    if (customTopicsByClass['12th'].length > 0) {
      result['12th Grade']['Custom Topics'] = customTopicsByClass['12th'];
    }
  }
  
  return result;
};

// Helper function to get all topics organized by grade and chapter
export const getTopicsByGradeAndChapter = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  return getChaptersByGrade(subject);
};