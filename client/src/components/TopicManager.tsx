import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, Search, BookOpen, Save, X } from 'lucide-react';
import { topicStorage } from '@/lib/localStorage';
import { getAllTopicsForSubject, isCustomTopic, organizeTopicsByCategory, searchTopics } from '@/lib/topicUtils';

interface EditingTopic {
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  originalName: string;
  newName: string;
}

export default function TopicManager() {
  const [activeSubject, setActiveSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicSubject, setNewTopicSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [editingTopic, setEditingTopic] = useState<EditingTopic | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force re-render when topics change
  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;

    try {
      topicStorage.addTopic(newTopicSubject, newTopicName.trim());
      setNewTopicName('');
      setIsAddDialogOpen(false);
      forceRefresh();
    } catch (error) {
      console.error('Failed to add topic:', error);
    }
  };

  const handleEditTopic = (subject: 'Physics' | 'Chemistry' | 'Mathematics', originalName: string) => {
    setEditingTopic({
      subject,
      originalName,
      newName: originalName
    });
  };

  const handleSaveEdit = () => {
    if (!editingTopic || !editingTopic.newName.trim()) return;

    try {
      topicStorage.updateTopic(editingTopic.subject, editingTopic.originalName, editingTopic.newName.trim());
      setEditingTopic(null);
      forceRefresh();
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
  };

  const handleDeleteTopic = (subject: 'Physics' | 'Chemistry' | 'Mathematics', topicName: string) => {
    if (!isCustomTopic(subject, topicName)) {
      alert('Cannot delete default topics. Only custom topics can be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete the topic "${topicName}"?`)) {
      try {
        topicStorage.removeTopic(subject, topicName);
        forceRefresh();
      } catch (error) {
        console.error('Failed to delete topic:', error);
      }
    }
  };

  const handleBulkAddTopics = (subject: 'Physics' | 'Chemistry' | 'Mathematics', topicsText: string) => {
    const topics = topicsText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (topics.length > 0) {
      try {
        topicStorage.addMultipleTopics(subject, topics);
        forceRefresh();
      } catch (error) {
        console.error('Failed to add topics:', error);
      }
    }
  };

  const SubjectTopicView = ({ subject }: { subject: 'Physics' | 'Chemistry' | 'Mathematics' }) => {
    const categorizedTopics = organizeTopicsByCategory(subject);
    if (searchQuery) {
      const filteredTopics = searchTopics(searchQuery, subject) as string[];
      return (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredTopics.length} topics found for "{searchQuery}"
          </div>
          <div className="grid gap-2">
            {filteredTopics.map((topic) => (
              <TopicItem
                key={topic}
                subject={subject}
                topic={topic}
                isCustom={isCustomTopic(subject, topic)}
                onEdit={() => handleEditTopic(subject, topic)}
                onDelete={() => handleDeleteTopic(subject, topic)}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <Accordion type="multiple" className="space-y-2" data-testid={`accordion-${subject.toLowerCase()}`}>
        {Object.entries(categorizedTopics).map(([category, topics]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-left" data-testid={`accordion-trigger-${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{category}</span>
                <Badge variant="secondary">{topics.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 pt-2">
                {topics.map((topic) => (
                  <TopicItem
                    key={topic}
                    subject={subject}
                    topic={topic}
                    isCustom={isCustomTopic(subject, topic)}
                    onEdit={() => handleEditTopic(subject, topic)}
                    onDelete={() => handleDeleteTopic(subject, topic)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  const TopicItem = ({
    subject,
    topic,
    isCustom,
    onEdit,
    onDelete
  }: {
    subject: 'Physics' | 'Chemistry' | 'Mathematics';
    topic: string;
    isCustom: boolean;
    onEdit: () => void;
    onDelete: () => void;
  }) => {
    const isEditing = editingTopic?.subject === subject && editingTopic?.originalName === topic;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20" data-testid={`edit-topic-${topic}`}>
          <Input
            value={editingTopic?.newName || ''}
            onChange={(e) => setEditingTopic(prev => prev ? { ...prev, newName: e.target.value } : null)}
            className="flex-1"
            data-testid={`input-edit-topic-${topic}`}
          />
          <Button size="sm" onClick={handleSaveEdit} data-testid={`button-save-topic-${topic}`}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancelEdit} data-testid={`button-cancel-topic-${topic}`}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2 border rounded-md hover-elevate" data-testid={`topic-item-${topic}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm" data-testid={`text-topic-${topic}`}>{topic}</span>
          {isCustom && <Badge variant="outline" data-testid={`badge-custom-${topic}`}>Custom</Badge>}
        </div>
        <div className="flex items-center gap-1">
          {isCustom && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onEdit}
              data-testid={`button-edit-topic-${topic}`}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {isCustom && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onDelete}
              data-testid={`button-delete-topic-${topic}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const BulkAddDialog = ({ subject }: { subject: 'Physics' | 'Chemistry' | 'Mathematics' }) => {
    const [bulkTopics, setBulkTopics] = useState('');
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

    const handleBulkAdd = () => {
      handleBulkAddTopics(subject, bulkTopics);
      setBulkTopics('');
      setIsBulkDialogOpen(false);
    };

    return (
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" data-testid={`button-bulk-add-${subject.toLowerCase()}`}>
            <Plus className="h-4 w-4 mr-2" />
            Bulk Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Add Topics - {subject}</DialogTitle>
            <DialogDescription>
              Enter multiple topics, one per line. These will be added as custom topics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-topics">Topics (one per line)</Label>
              <textarea
                id="bulk-topics"
                className="w-full min-h-32 mt-1 p-2 border rounded-md"
                value={bulkTopics}
                onChange={(e) => setBulkTopics(e.target.value)}
                placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                data-testid={`textarea-bulk-topics-${subject.toLowerCase()}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)} data-testid="button-cancel-bulk-add">
              Cancel
            </Button>
            <Button onClick={handleBulkAdd} disabled={!bulkTopics.trim()} data-testid="button-save-bulk-add">
              Add Topics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card key={refreshKey} data-testid="topic-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Topic Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-topic">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Topic</DialogTitle>
                  <DialogDescription>
                    Add a custom topic to any subject. Custom topics can be edited and deleted.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={newTopicSubject} onValueChange={(value: any) => setNewTopicSubject(value)}>
                      <SelectTrigger data-testid="select-topic-subject">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="topic-name">Topic Name</Label>
                    <Input
                      id="topic-name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Enter topic name"
                      data-testid="input-topic-name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-add">
                    Cancel
                  </Button>
                  <Button onClick={handleAddTopic} disabled={!newTopicName.trim()} data-testid="button-save-add">
                    Add Topic
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage all JEE topics by subject. Add custom topics, edit existing ones, and organize your study materials.
        </p>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics across all subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-topics"
            />
          </div>
        </div>

        {/* Subject Tabs */}
        <Tabs value={activeSubject} onValueChange={(value) => setActiveSubject(value as any)} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList data-testid="tabs-subjects">
              <TabsTrigger value="Physics" data-testid="tab-physics">Physics</TabsTrigger>
              <TabsTrigger value="Chemistry" data-testid="tab-chemistry">Chemistry</TabsTrigger>
              <TabsTrigger value="Mathematics" data-testid="tab-mathematics">Mathematics</TabsTrigger>
            </TabsList>
            <BulkAddDialog subject={activeSubject} />
          </div>

          <TabsContent value="Physics" className="space-y-4" data-testid="content-physics">
            <div className="text-sm text-muted-foreground">
              {getAllTopicsForSubject('Physics').length} topics available
            </div>
            <SubjectTopicView subject="Physics" />
          </TabsContent>

          <TabsContent value="Chemistry" className="space-y-4" data-testid="content-chemistry">
            <div className="text-sm text-muted-foreground">
              {getAllTopicsForSubject('Chemistry').length} topics available
            </div>
            <SubjectTopicView subject="Chemistry" />
          </TabsContent>

          <TabsContent value="Mathematics" className="space-y-4" data-testid="content-mathematics">
            <div className="text-sm text-muted-foreground">
              {getAllTopicsForSubject('Mathematics').length} topics available
            </div>
            <SubjectTopicView subject="Mathematics" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}