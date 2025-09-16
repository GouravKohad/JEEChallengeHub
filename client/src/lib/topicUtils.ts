import { JEE_TOPICS } from '@shared/schema';
import { CustomTopics, topicStorage } from '@/lib/localStorage';

// Helper function to get all topics (default + custom) for a subject
export const getAllTopicsForSubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics'): string[] => {
  const defaultTopics = JEE_TOPICS[subject];
  const customTopics = topicStorage.getAll();
  
  // Merge default and custom topics, removing duplicates
  const allTopics = [...defaultTopics, ...customTopics[subject]];
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

// Helper function to organize topics by category (for display purposes)
export const organizeTopicsByCategory = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  const allTopics = getAllTopicsForSubject(subject);
  const categories: { [key: string]: string[] } = {};
  
  // Organize default topics by their comment-based categories
  const defaultTopics = JEE_TOPICS[subject];
  const customTopics = topicStorage.getAll()[subject];
  
  // For Physics
  if (subject === 'Physics') {
    categories['Mechanics'] = defaultTopics.slice(0, 31);
    categories['Properties of Matter'] = defaultTopics.slice(31, 37);
    categories['Heat and Thermodynamics'] = defaultTopics.slice(37, 45);
    categories['Oscillations and Waves'] = defaultTopics.slice(45, 52);
    categories['Electricity and Magnetism'] = defaultTopics.slice(52, 70);
    categories['Electromagnetic Waves and Optics'] = defaultTopics.slice(70, 80);
    categories['Modern Physics'] = defaultTopics.slice(80);
  }
  // For Chemistry
  else if (subject === 'Chemistry') {
    categories['Physical Chemistry'] = defaultTopics.slice(0, 48);
    categories['Inorganic Chemistry'] = defaultTopics.slice(48, 62);
    categories['Organic Chemistry'] = defaultTopics.slice(62);
  }
  // For Mathematics
  else if (subject === 'Mathematics') {
    categories['Algebra'] = defaultTopics.slice(0, 26);
    categories['Coordinate Geometry'] = defaultTopics.slice(26, 40);
    categories['Calculus'] = defaultTopics.slice(40, 58);
    categories['Vector Algebra and Geometry'] = defaultTopics.slice(58, 62);
    categories['Statistics and Probability'] = defaultTopics.slice(62, 70);
    categories['Mathematical Reasoning'] = defaultTopics.slice(70, 76);
    categories['Matrices and Determinants'] = defaultTopics.slice(76);
  }
  
  // Add custom topics to a separate category
  if (customTopics.length > 0) {
    categories['Custom Topics'] = customTopics;
  }
  
  return categories;
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