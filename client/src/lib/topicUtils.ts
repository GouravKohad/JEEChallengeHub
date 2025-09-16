import { JEE_TOPICS, JEE_CHAPTERS, getChaptersForSubject, getTopicsForChapter, getAllTopicsForSubject as getSchemaTopics, getChapterForTopic } from '@shared/schema';
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
    categories['Custom Topics'] = customTopics;
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
    result['Custom Topics'] = customTopics;
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