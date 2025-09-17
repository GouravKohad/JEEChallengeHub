import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Calendar, Clock, BookOpen } from "lucide-react";
import { CHALLENGE_TYPES, JEE_SUBJECTS, JEE_TOPICS, InsertChallenge } from "@shared/schema";
import { addDays, format } from "date-fns";
import { getAllTopicsForSubject, getTopicsByGradeAndChapter, isCustomTopic } from "@/lib/topicUtils";

interface ChallengeCreationModalProps {
  onCreateChallenge?: (challenge: InsertChallenge) => void;
  children?: React.ReactNode;
}

export default function ChallengeCreationModal({ onCreateChallenge, children }: ChallengeCreationModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<typeof CHALLENGE_TYPES[number]>(CHALLENGE_TYPES[0]);
  const [customName, setCustomName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({});
  const [dailyHours, setDailyHours] = useState([4]);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubjectToggle = (subject: string) => {
    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    
    setSelectedSubjects(newSubjects);
    
    // Remove topics for unselected subjects
    if (!newSubjects.includes(subject)) {
      const newTopics = { ...selectedTopics };
      delete newTopics[subject];
      setSelectedTopics(newTopics);
    }
  };

  const handleTopicToggle = (subject: string, topic: string) => {
    const currentTopics = selectedTopics[subject] || [];
    const newTopics = currentTopics.includes(topic)
      ? currentTopics.filter(t => t !== topic)
      : [...currentTopics, topic];
    
    setSelectedTopics({
      ...selectedTopics,
      [subject]: newTopics
    });
  };

  const handleCreate = () => {
    console.log('Creating challenge with:', {
      type: selectedType,
      name: customName || selectedType.name,
      subjects: selectedSubjects,
      topics: selectedTopics,
      dailyHours: dailyHours[0],
      startDate
    });
    
    const challenge: InsertChallenge = {
      type: selectedType.id,
      name: customName || selectedType.name,
      duration: selectedType.duration,
      subjects: selectedSubjects as any,
      topics: selectedTopics,
      startDate,
      endDate: format(addDays(new Date(startDate), selectedType.duration), 'yyyy-MM-dd'),
      dailyTimeHours: dailyHours[0],
      status: 'active'
    };
    
    onCreateChallenge?.(challenge);
    setOpen(false);
  };

  const isValidChallenge = selectedSubjects.length > 0 && 
    selectedSubjects.every(subject => (selectedTopics[subject] || []).length > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button data-testid="button-create-challenge">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New JEE Challenge</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Challenge Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose Challenge Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHALLENGE_TYPES.map((type) => (
                <Card 
                  key={type.id} 
                  className={`cursor-pointer hover-elevate transition-colors ${
                    selectedType.id === type.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedType(type)}
                  data-testid={`card-challenge-type-${type.id}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {type.duration} days
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Name */}
          <div className="space-y-2">
            <Label htmlFor="challenge-name">Custom Challenge Name (Optional)</Label>
            <Input
              id="challenge-name"
              placeholder={selectedType.name}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              data-testid="input-challenge-name"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              data-testid="input-start-date"
            />
          </div>

          {/* Daily Study Hours */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Daily Study Hours: {dailyHours[0]}h
            </Label>
            <Slider
              value={dailyHours}
              onValueChange={setDailyHours}
              max={12}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-daily-hours"
            />
          </div>

          {/* Subject Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Select Subjects
            </Label>
            <div className="flex gap-4">
              {JEE_SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox 
                    id={subject}
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                    data-testid={`checkbox-subject-${subject}`}
                  />
                  <Label htmlFor={subject} className="text-sm font-medium">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          {selectedSubjects.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Topics</Label>
              {selectedSubjects.map((subject) => {
                const gradeTopics = getTopicsByGradeAndChapter(subject as 'Physics' | 'Chemistry' | 'Mathematics');
                return (
                  <Card key={subject}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(gradeTopics).map(([grade, chapters]) => {
                          const hasChapters = Object.keys(chapters).length > 0;
                          if (!hasChapters) return null;
                          
                          return (
                            <AccordionItem key={`${subject}-${grade}`} value={`${subject}-${grade}`}>
                              <AccordionTrigger className="text-base font-medium">
                                <div className="flex items-center gap-2">
                                  <span>{grade}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {Object.values(chapters).flat().length} topics
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4">
                                  {Object.entries(chapters).map(([chapter, topics]) => (
                                    <div key={`${subject}-${chapter}`} className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">{chapter}</h4>
                                        <Badge variant="secondary" className="text-xs">
                                          {topics.length}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                                        {topics.map((topic) => (
                                          <div key={topic} className="flex items-center space-x-2">
                                            <Checkbox 
                                              id={`${subject}-${topic}`}
                                              checked={(selectedTopics[subject] || []).includes(topic)}
                                              onCheckedChange={() => handleTopicToggle(subject, topic)}
                                              data-testid={`checkbox-topic-${subject}-${topic}`}
                                            />
                                            <Label 
                                              htmlFor={`${subject}-${topic}`} 
                                              className="text-sm leading-tight flex items-center gap-1"
                                            >
                                              {topic}
                                              {isCustomTopic(subject as 'Physics' | 'Chemistry' | 'Mathematics', topic) && (
                                                <Badge variant="outline" className="text-xs px-1">
                                                  Custom
                                                </Badge>
                                              )}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {selectedSubjects.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Challenge Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Duration:</span> {selectedType.duration} days
                  </div>
                  <div>
                    <span className="font-semibold">Daily Hours:</span> {dailyHours[0]}h
                  </div>
                  <div>
                    <span className="font-semibold">Start Date:</span> {format(new Date(startDate), 'MMM dd, yyyy')}
                  </div>
                  <div>
                    <span className="font-semibold">End Date:</span> {format(addDays(new Date(startDate), selectedType.duration), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Subjects & Topics:</span>
                  <div className="mt-2 space-y-2">
                    {selectedSubjects.map((subject) => (
                      <div key={subject}>
                        <span className="text-sm font-medium">{subject}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(selectedTopics[subject] || []).map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!isValidChallenge}
              data-testid="button-create"
            >
              Create Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}